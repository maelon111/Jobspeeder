import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOpenAI, CV_OPTIMIZE_SYSTEM_PROMPT } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { cv_content } = await request.json()
    if (!cv_content) {
      return NextResponse.json({ error: 'cv_content is required' }, { status: 400 })
    }

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CV_OPTIMIZE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Optimize this CV for ATS and recruiters. Return only valid JSON with the same structure:\n\n${JSON.stringify(cv_content, null, 2)}`
        },
      ],
      temperature: 0.3,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const optimizedText = completion.choices[0].message.content
    if (!optimizedText) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    const optimized = JSON.parse(optimizedText)
    return NextResponse.json({ optimized, tokens_used: completion.usage?.total_tokens })

  } catch (error) {
    console.error('CV optimize error:', error)
    return NextResponse.json({ error: 'Failed to optimize CV' }, { status: 500 })
  }
}
