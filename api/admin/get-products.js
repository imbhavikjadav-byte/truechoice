import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Get all products or filter by category
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const adminPassword = req.headers['x-admin-password']
  if (adminPassword !== process.env.VITE_ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { category } = req.query
    let query = supabase.from('products').select('*')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    const { data: products, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch products' })
    }

    return res.status(200).json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
