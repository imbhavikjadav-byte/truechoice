import { createClient } from '@supabase/supabase-js'

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
    const { id } = req.body
    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return res.status(500).json({ error: 'Failed to delete product' })
    }

    return res.status(200).json({ success: true, id })
  } catch (error) {
    console.error('Error deleting product:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
