import { AIInsight, AIInsightCreateData, SurveyAnalysis } from '@/types'

/**
 * Save AI insights to the database
 */
export const saveAIInsights = async (
  surveyId: string, 
  analysisData: SurveyAnalysis, 
  supabase: any
): Promise<{ success: boolean; data?: AIInsight; error?: string }> => {
  try {
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    const insightData: AIInsightCreateData = {
      survey_id: surveyId,
      analysis_data: analysisData,
      created_by: user.id
    }

    const { data, error } = await supabase
      .from('ai_insights')
      .insert(insightData)
      .select()
      .single()

    if (error) {
      console.error('Error saving AI insights:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as AIInsight }
  } catch (error: any) {
    console.error('Error saving AI insights:', error)
    return { success: false, error: error.message || 'Failed to save AI insights' }
  }
}

/**
 * Get the latest AI insights for a survey
 */
export const getLatestAIInsights = async (
  surveyId: string, 
  supabase: any
): Promise<{ success: boolean; data?: AIInsight; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('survey_id', surveyId)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return { success: true, data: undefined }
      }
      console.error('Error fetching AI insights:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as AIInsight }
  } catch (error: any) {
    console.error('Error fetching AI insights:', error)
    return { success: false, error: error.message || 'Failed to fetch AI insights' }
  }
}

/**
 * Get all AI insights for a survey (for history)
 */
export const getAllAIInsights = async (
  surveyId: string, 
  supabase: any
): Promise<{ success: boolean; data?: AIInsight[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('survey_id', surveyId)
      .order('generated_at', { ascending: false })

    if (error) {
      console.error('Error fetching AI insights history:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data: data as AIInsight[] }
  } catch (error: any) {
    console.error('Error fetching AI insights history:', error)
    return { success: false, error: error.message || 'Failed to fetch AI insights history' }
  }
}

/**
 * Delete AI insights for a survey
 */
export const deleteAIInsights = async (
  surveyId: string, 
  supabase: any
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('survey_id', surveyId)

    if (error) {
      console.error('Error deleting AI insights:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting AI insights:', error)
    return { success: false, error: error.message || 'Failed to delete AI insights' }
  }
}
