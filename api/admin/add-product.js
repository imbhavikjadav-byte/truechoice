import { Redis } from '@upstash/redis'
import { createClient } from '@supabase/supabase-js'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Add new product to Supabase
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.VITE_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const productData = req.body
    const { data, error } = await supabase.from('products').insert([productData]).select().single()

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Failed to add product' })
    }

    const { category } = req.body
    if (category) {
      try {
        const pattern = `rec:${category}:*`
        let cursor = 0
        do {
          const result = await redis.scan(cursor, { match: pattern, count: 100 })
          cursor = result[0]
          const keys = result[1]
          if (keys.length > 0) {
            await redis.del(...keys)
          }
        } while (cursor !== 0)
      } catch (cacheError) {
        console.error('Cache invalidation failed:', cacheError)
      }
    }

    return res.status(201).json(data)
  } catch (error) {
    console.error('Error adding product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
