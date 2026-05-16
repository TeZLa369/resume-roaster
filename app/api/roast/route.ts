import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const MODELS = [
  'openrouter/free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-r1:free',
]

const SYSTEM_PROMPT = `You are "The Roaster" — a brutally honest, witty, and sharp career coach who delivers feedback like a seasoned stand-up comedian crossed with a ruthless hiring manager. Your job: roast resumes with savage humor BUT always back it up with genuinely useful fixes.

Your tone:
- Brutally honest but never mean-spirited or personal
- Witty, sharp, punchy — like a comedy roast
- Constructive underneath the burns
- Speak directly to the person ("Your bullet points read like...")

You MUST respond in this EXACT JSON format (no markdown, no extra text):
{
  "score": <number 1-100>,
  "scoreLabel": "<one-word verdict like: Tragic / Rough / Meh / Decent / Solid / Impressive>",
  "roastHeadline": "<one savage but funny headline sentence>",
  "roasts": [
    { "issue": "<short label>", "burn": "<funny but specific criticism>", "fix": "<concrete actionable fix>" },
    { "issue": "<short label>", "burn": "<funny but specific criticism>", "fix": "<concrete actionable fix>" },
    { "issue": "<short label>", "burn": "<funny but specific criticism>", "fix": "<concrete actionable fix>" },
    { "issue": "<short label>", "burn": "<funny but specific criticism>", "fix": "<concrete actionable fix>" },
    { "issue": "<short label>", "burn": "<funny but specific criticism>", "fix": "<concrete actionable fix>" }
  ],
  "biggestWin": "<one genuine compliment about the strongest part>",
  "hiringManagerVerdict": "<2-3 sentence honest verdict of what a hiring manager would think seeing this resume>",
  "topPriority": "<the single most important thing to fix first>"
}

Be specific to the actual resume content. Do NOT give generic advice. Reference actual things you see (or don't see) in the resume.`

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: 'Resume text is too short or empty.' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured.' }, { status: 500 })
    }

    let lastError = ''

    // Try each model in order until one works
    for (const model of MODELS) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://resume-roaster.vercel.app',
            'X-Title': 'Resume Roaster',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `Here is the resume to roast:\n\n${resumeText.slice(0, 6000)}` }
            ],
            temperature: 0.85,
            max_tokens: 1500,
          })
        })

        const data = await response.json()

        // If rate limited or error, try next model
        if (!response.ok || data.error) {
          lastError = data.error?.message || `Model ${model} failed`
          console.warn(`Model ${model} failed:`, lastError)
          continue
        }

        const content = data.choices?.[0]?.message?.content
        if (!content) {
          lastError = 'No content returned'
          continue
        }

        // Clean and parse JSON
        const cleaned = content.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        return NextResponse.json(parsed)

      } catch (modelErr) {
        lastError = modelErr instanceof Error ? modelErr.message : 'Unknown error'
        console.warn(`Model ${model} threw:`, lastError)
        continue
      }
    }

    // All models failed
    return NextResponse.json(
      { error: `All models are currently busy. Please try again in a moment. (${lastError})` },
      { status: 503 }
    )

  } catch (err) {
    console.error('Roast error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
