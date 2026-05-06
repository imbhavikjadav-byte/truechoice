import { Redis } from '@upstash/redis'
import { MOCK_PRODUCTS } from '../src/utils/mockProducts.js'

const isDev = process.env.VITE_DEV_MODE === 'true'

const redis = isDev
  ? null
  : new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

// Generate cache key
function generateCacheKey(category, answers) {
  const sorted = Object.keys(answers)
    .sort()
    .map(k => `${k}:${answers[k]}`)
    .join('|')
  let hash = 5381
  for (let i = 0; i < sorted.length; i++) {
    hash = ((hash << 5) + hash) + sorted.charCodeAt(i)
  }
  return `rec:${category}:${Math.abs(hash).toString(16)}`
}

// Call Claude Haiku API
async function callClaudeAPI(systemPrompt, userPrompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

// Format products for Claude
function formatProductsForClaude(products) {
  return products
    .map(
      p =>
        `ID:${p.id} | ${p.name} | ₹${p.price} | ${p.brand} | ${p.category} | Rating: ${p.amazon_rating || 'N/A'}`
    )
    .join('\n')
}

// Main handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category, answers } = req.body

    if (!category || !answers) {
      return res.status(400).json({ error: 'Missing category or answers' })
    }

    // Generate cache key
    const cacheKey = generateCacheKey(category, answers)

    // Check Redis cache (skipped in dev mode)
    if (!isDev) {
      try {
        const cached = await redis.get(cacheKey)
        if (cached) {
          return res.status(200).json({
            recommendations: JSON.parse(cached),
            from_cache: true,
          })
        }
      } catch (error) {
        console.log('Cache check failed, proceeding with Claude API')
      }
    }

    // Use mock products in dev mode, otherwise fetch from Supabase
    const products = isDev ? MOCK_PRODUCTS : []

    if (products.length === 0) {
      return res.status(200).json({
        recommendations: [
          {
            id: 'demo1',
            name: 'ASUS ROG Strix G15',
            brand: 'ASUS',
            price: 75000,
            image_url: 'https://via.placeholder.com/400x300?text=ASUS+ROG',
            affiliate_link: 'https://amazon.in',
            amazon_rating: 4.4,
            match_score: 96,
            is_best_pick: true,
            reasoning: 'Perfect for gaming with powerful GPU and 144Hz display.',
            specs: {
              processor: 'AMD Ryzen 7 6800H',
              ram: '16GB',
              storage: '512GB SSD',
              display: '15.6 inch 144Hz FHD',
              battery: '4 hours',
            },
          },
        ],
        from_cache: false,
      })
    }

    // Build Claude prompt
    const systemPrompt = `You are a product recommendation engine. You will receive a user's requirements and a list of products. Your job is to select the 3 best matching products and explain why each is a good fit. Always respond in valid JSON only. No preamble, no explanation outside the JSON.`

    const userPrompt = `User needs a ${category} with these requirements:
- Use case: ${answers.use_case}
- Budget: ₹${answers.budget}
- Priority: ${answers.priority}
- Brand preference: ${answers.brand}
- Battery importance: ${answers.battery}

Available products:
${formatProductsForClaude(products)}

Return exactly this JSON structure:
{
  "recommendations": [
    {
      "id": "product_id",
      "reasoning": "2-3 sentence personalised explanation",
      "match_score": 95
    }
  ]
}

Only pick from the provided product list.`

    // Call Claude
    const claudeResponse = await callClaudeAPI(systemPrompt, userPrompt)
    const parsed = JSON.parse(claudeResponse)

    // Enrich recommendations with full product data
    const enriched = parsed.recommendations.map((rec, index) => {
      const product = products.find(p => p.id === rec.id)
      return {
        ...product,
        ...rec,
        is_best_pick: index === 0,
      }
    })

    // Cache result (skipped in dev mode)
    if (!isDev) {
      try {
        await redis.set(cacheKey, JSON.stringify(enriched), { ex: 604800 })
      } catch (error) {
        console.log('Cache write failed, but returning results')
      }
    }

    return res.status(200).json({
      recommendations: enriched,
      from_cache: false,
    })
  } catch (error) {
    console.error('Error in recommend endpoint:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
