import { createClient } from '@/lib/supabase/server'
import { fetchAndFormatSurveyDataForAI } from '@/lib/utils/survey-ai-formatter'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
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
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })

  } catch (error: any) {
    console.error('Error fetching AI formatted survey data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
