import { createClient } from '@supabase/supabase-js'

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

    return res.status(201).json(data)
  } catch (error) {
    console.error('Error adding product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
