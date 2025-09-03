import { createClient } from '@/lib/supabase/server'
import { fetchAndFormatSurveyDataForAI } from '@/lib/utils/survey-ai-formatter'
import { saveAIInsights } from '@/lib/utils/ai-insights-db'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define a general schema for survey analysis
const surveyAnalysisSchema = {
  name: "survey_analysis",
  schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      strengths: { type: "array", items: { type: "string" } },
      weaknesses: { type: "array", items: { type: "string" } },
      themes: {
        type: "array",
        items: {
          type: "object",
          properties: {
            theme: { type: "string" },
            frequency: { type: "integer" },
            sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
          },
          required: ["theme", "frequency"],
        },
      },
      recommendations: {
        type: "array",
        items: {
          type: "object",
          properties: {
            area: { type: "string" },
            suggestion: { type: "string" },
            impact: { type: "string", enum: ["high", "medium", "low"] },
          },
          required: ["area", "suggestion"],
        },
      },
    },
    required: ["summary", "strengths", "weaknesses", "recommendations"],
  },
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has access to this survey
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('user_id', user.id)
      .single()

    if (!profile?.business_id) {
      return NextResponse.json({ error: 'Business access required' }, { status: 403 })
    }

    // Fetch and format the survey data
    const result = await fetchAndFormatSurveyDataForAI(params.id, supabase)
    
    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error || 'Failed to fetch survey data' }, { status: 500 })
    }

    const { survey_metadata, responses } = result.data

    if (!survey_metadata || !responses || responses.length === 0) {
      return NextResponse.json({ error: 'No survey data or responses found' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Send to OpenAI
    const aiResponse = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: "You are a survey analyst. Use survey metadata to understand the type (product, customer, employee, etc.) and adapt insights accordingly. Always return structured JSON following the schema."
        },
        {
          role: "user",
          content: JSON.stringify({ survey_metadata, responses })
        }
      ],
      response_format: { type: "json_schema", json_schema: surveyAnalysisSchema },
    //   temperature: 0.7,
    })

    const analysisResult = JSON.parse(aiResponse.choices[0]?.message?.content || '{}')

    // Save the AI insights to the database
    const saveResult = await saveAIInsights(params.id, analysisResult, supabase)
    
    if (!saveResult.success) {
      console.error('Failed to save AI insights:', saveResult.error)
      // Still return the analysis even if saving fails
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
      saved: saveResult.success,
      insight_id: saveResult.data?.id
    })

  } catch (error: any) {
    console.error('Survey Analysis Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
