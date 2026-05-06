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

// Update existing product
export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.VITE_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { id, ...updateData } = req.body
    const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select().single()

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ error: 'Failed to update product' })
    }

    // Invalidate related cache keys
    try {
      const category = updateData.category
      if (category) {
        const pattern = `rec:${category}:*`
        // Note: Upstash doesn't support SCAN with pattern in REST API
        // In production, you'd need to track cache keys or use a different approach
      }
    } catch (error) {
      console.log('Cache invalidation failed, but continuing')
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error updating product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
