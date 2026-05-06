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

// Delete product from Supabase
export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.VITE_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { id, category } = req.body
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return res.status(500).json({ error: 'Failed to delete product' })
    }

    if (category) {
      const invalidate = async () => {
        const pattern = `rec:${category}:*`
        let cursor = 0
        do {
          const result = await redis.scan(cursor, { match: pattern, count: 100 })
          cursor = result[0]
          const keys = result[1]
          if (keys.length > 0) await redis.del(...keys)
        } while (cursor !== 0)
      }
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      try {
        await Promise.race([invalidate(), timeout])
      } catch (cacheError) {
        console.error('Cache invalidation failed:', cacheError)
      }
    }

    return res.status(200).json({ success: true, id })
  } catch (error) {
    console.error('Error deleting product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
