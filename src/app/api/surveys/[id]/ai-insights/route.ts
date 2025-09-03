import { createClient } from '@/lib/supabase/server'
import { getLatestAIInsights, getAllAIInsights } from '@/lib/utils/ai-insights-db'
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

    const { searchParams } = new URL(request.url)
    const includeHistory = searchParams.get('history') === 'true'

    if (includeHistory) {
      // Get all AI insights for history
      const result = await getAllAIInsights(params.id, supabase)
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: result.data || [],
        has_insights: (result.data?.length || 0) > 0
      })
    } else {
      // Get latest AI insights only
      const result = await getLatestAIInsights(params.id, supabase)
      
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        has_insights: !!result.data
      })
    }

  } catch (error: any) {
    console.error('Error fetching AI insights:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
