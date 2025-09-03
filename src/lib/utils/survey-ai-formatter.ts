import { Survey, SurveyResponse, AIFormattedSurveyData, AIFormattedSurveyResult } from '@/types'

/**
 * Formats survey data and responses for AI processing
 * Similar to the structure in survey_metadata.json
 */
export const formatSurveyDataForAI = (survey: Survey, responses: SurveyResponse[]): AIFormattedSurveyData => {
  const formattedData: AIFormattedSurveyData = {
    survey_metadata: {
      title: survey.title,
      description: survey.description || '',
      target_audience: survey.target_audience || '',
      purpose: survey.purpose || '',
      questions: survey.survey_data?.questions || []
    },
    responses: responses.map(response => {
      const formattedResponse: Record<string, any> = {}
      
      // Process each question response
      if (response.response_data && typeof response.response_data === 'object') {
        Object.keys(response.response_data).forEach(questionId => {
          const answer = response.response_data[questionId]
          formattedResponse[questionId] = answer
        })
      }
      
      return formattedResponse
    })
  }
  
  return formattedData
}

/**
 * Fetches survey data and responses from the database and formats them for AI
 */
export const fetchAndFormatSurveyDataForAI = async (surveyId: string, supabase: any): Promise<AIFormattedSurveyResult> => {
  try {
    // Fetch survey data
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .single()

    if (surveyError) throw surveyError

    // Fetch survey responses
    const { data: responseData, error: responseError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId)
      .order('submitted_at', { ascending: false })

    if (responseError) throw responseError

    // Format the data
    const formattedData = formatSurveyDataForAI(
      surveyData as Survey, 
      (responseData || []) as SurveyResponse[]
    )

    return {
      success: true,
      data: formattedData,
      survey: surveyData,
      responses: responseData
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to fetch and format survey data',
      data: undefined
    }
  }
}
