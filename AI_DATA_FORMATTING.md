# AI Data Formatting for Survey Responses

This document describes the implementation of data formatting for AI processing of survey responses.

## Overview

The system now includes functionality to fetch survey data and responses from the database and format them in a structure similar to `survey_metadata.json` for AI processing.

## Implementation

### 1. Utility Functions (`src/lib/utils/survey-ai-formatter.ts`)

- **`formatSurveyDataForAI(survey, responses)`**: Formats survey data and responses into AI-ready structure
- **`fetchAndFormatSurveyDataForAI(surveyId, supabase)`**: Fetches data from database and formats it

### 2. API Endpoint (`src/app/api/surveys/[id]/ai-data/route.ts`)

- **GET `/api/surveys/[id]/ai-data`**: Returns formatted survey data for AI processing
- Requires authentication and business access
- Returns data in the same format as the utility functions

### 3. UI Integration (`src/app/business/surveys/[id]/responses/page.tsx`)

- Automatically formats data when page loads
- Manual trigger button: "Format Data for AI"
- Debug section displays formatted data on the page
- Console logs the formatted data

## Data Structure

The formatted data follows this structure:

```typescript
{
  survey_metadata: {
    title: string;
    description: string;
    target_audience: string;
    purpose: string;
    questions: SurveyQuestion[];
  },
  responses: Record<string, any>[];
}
```

## Database Fields Required

From the `surveys` table:
- `title`
- `description`
- `survey_data` (JSONB containing questions)
- `target_audience`
- `purpose`

From the `survey_responses` table:
- `response_data` (JSONB containing answers)

## Usage

### In the UI:
1. Navigate to a survey's responses page
2. Data is automatically formatted and logged to console
3. Click "Format Data for AI" button to manually trigger formatting
4. View formatted data in the debug section

### Via API:
```javascript
const response = await fetch('/api/surveys/[survey-id]/ai-data', {
  headers: {
    'Authorization': 'Bearer [token]'
  }
});
const data = await response.json();
```

### Programmatically:
```javascript
import { fetchAndFormatSurveyDataForAI } from '@/lib/utils/survey-ai-formatter';

const result = await fetchAndFormatSurveyDataForAI(surveyId, supabase);
if (result.success) {
  console.log('AI Formatted Data:', result.data);
}
```

## TypeScript Types

The implementation includes proper TypeScript types:
- `AIFormattedSurveyMetadata`
- `AIFormattedSurveyData`
- `AIFormattedSurveyResult`

## AI Insights Generation & Storage

### Database Schema (`database/migrations/006_add_ai_insights_table.sql`)

- **`ai_insights` table**: Stores AI-generated insights for surveys
- **Fields**: id, survey_id, analysis_data (JSONB), generated_at, created_by
- **Indexes**: Optimized for survey_id and generated_at queries
- **RLS Policies**: Business owners can manage their survey insights

### API Endpoints

#### Generate AI Insights (`src/app/api/surveys/[id]/analyze/route.ts`)
- **POST `/api/surveys/[id]/analyze`**: Generates AI insights from survey data
- Uses OpenAI GPT-4o-mini with structured JSON output
- **Automatically saves** insights to database
- Returns analysis with summary, strengths, weaknesses, themes, and recommendations

#### Retrieve AI Insights (`src/app/api/surveys/[id]/ai-insights/route.ts`)
- **GET `/api/surveys/[id]/ai-insights`**: Get latest saved insights
- **GET `/api/surveys/[id]/ai-insights?history=true`**: Get all insights history

### Frontend Integration

The survey responses page now includes:
- **Dynamic button logic**: Shows "Generate AI Insights" when no insights exist, "View AI Insights" when available
- **"Load Saved Insights" button**: Retrieves previously saved insights
- **AI Insights Modal**: Full-screen modal displaying comprehensive analysis results
- **Status indicator**: Shows when insights are available with timestamp
- **Loading states**: Handles async operations gracefully
- **Auto-open modal**: Automatically opens modal after generating new insights

### AI Analysis Structure

The AI returns structured insights:

```typescript
{
  summary: string;
  strengths: string[];
  weaknesses: string[];
  themes: {
    theme: string;
    frequency: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }[];
  recommendations: {
    area: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}
```

### Usage

1. Navigate to a survey's responses page
2. **Saved insights are automatically loaded** if available
3. **If no insights exist**: Click "Generate AI Insights" button to create new analysis
4. **If insights exist**: Click "View AI Insights" button to open detailed modal
5. Click "Load Saved Insights" to manually reload saved insights
6. **Modal features**: 
   - Executive summary with key metrics
   - Detailed analysis with strengths, weaknesses, themes, and recommendations
   - Export functionality (planned)
   - Responsive design for all screen sizes
7. Saved insights show timestamp and are automatically preserved

### Environment Setup

Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## Next Steps for AI Integration

1. ✅ The formatted data is ready for AI processing
2. ✅ AI insights generation is implemented
3. ✅ Frontend displays AI analysis results
4. ✅ AI insights are automatically saved to database
5. ✅ Users can load saved insights on page refresh
6. ✅ AI insights modal with comprehensive view
7. ✅ Dynamic button logic based on insights availability
8. Consider adding additional metadata like response timestamps, completion rates, etc.
9. Add insights history view to compare different analyses
10. Implement insights export functionality
11. Add modal animations and transitions
