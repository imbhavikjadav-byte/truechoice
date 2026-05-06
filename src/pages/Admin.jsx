import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api'

export default function Admin() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({})
  const [searchTerm, setSearchTerm] = useState('')

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setIsLoggedIn(true)
      fetchProducts(adminPassword)
    } else {
      alert('Incorrect password')
      setPassword('')
    }
  }

  const fetchProducts = async (pass) => {
    setLoading(true)
    try {
      const data = await getProducts(selectedCategory, pass)
      setProducts(Array.isArray(data) ? data : data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts(adminPassword)
    }
  }, [selectedCategory, isLoggedIn, adminPassword])

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!adminPassword) {
      alert('Admin password not configured')
      return
    }
    // TODO: Implement add product
    setShowForm(false)
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteProduct(productId, adminPassword)
      setProducts(products.filter(p => p.id !== productId))
      alert('Product deleted successfully')
    } catch (error) {
      alert('Error deleting product: ' + error.message)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-blue-900 flex items-center justify-center px-6">
        <div className="bg-navy/50 border border-accent-blue/30 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-3xl font-display font-bold text-accent-blue text-center mb-8">
            TrueChoice Admin
          </h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-3 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue mb-4"
            />
            <button
              type="submit"
              className="w-full bg-accent-blue hover:bg-blue-600 text-navy font-bold py-3 rounded-lg transition-all"
            >
              Login
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-light-bg/60 hover:text-light-bg transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-blue-900 flex flex-col">
      {/* Header */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-accent-blue/20">
        <h1 className="text-2xl font-display font-bold text-accent-blue">TrueChoice Admin</h1>
        <button
          onClick={() => {
            setIsLoggedIn(false)
            navigate('/')
          }}
          className="text-light-bg/70 hover:text-light-bg transition-all"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg focus:outline-none focus:border-accent-blue"
            >
              <option value="all">All Categories</option>
              <option value="laptop">Laptops</option>
              <option value="mobile">Mobiles</option>
              <option value="earphone">Earphones</option>
            </select>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingProduct(null)
                setFormData({})
              }}
              className="bg-accent-blue hover:bg-blue-600 text-navy font-bold px-6 py-2 rounded-lg transition-all"
            >
              + Add Product
            </button>
          </div>

          {/* Products Table */}
          {loading ? (
            <div className="text-center text-light-bg/70">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-light-bg/70 py-12">
              No products found
            </div>
          ) : (
            <div className="bg-navy/30 border border-accent-blue/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-accent-blue/20">
                      <th className="px-4 py-3 text-left text-light-bg/70">Name</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Brand</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Category</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Price</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Rating</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Status</th>
                      <th className="px-4 py-3 text-left text-light-bg/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-accent-blue/10 hover:bg-accent-blue/5 transition-all">
                        <td className="px-4 py-3 text-light-bg">{product.name}</td>
                        <td className="px-4 py-3 text-light-bg/70">{product.brand}</td>
                        <td className="px-4 py-3 text-light-bg/70 text-sm">
                          <span className="bg-accent-blue/10 px-2 py-1 rounded">{product.category}</span>
                        </td>
                        <td className="px-4 py-3 text-light-bg">₹{product.price}</td>
                        <td className="px-4 py-3 text-light-bg/70">{product.amazon_rating || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-sm ${product.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(product)
                              setFormData(product)
                              setShowForm(true)
                            }}
                            className="text-accent-blue hover:text-blue-400 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal - Placeholder */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-navy/90 border border-accent-blue/30 rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-display font-bold text-light-bg mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <p className="text-light-bg/60 mb-6">
              Product form implementation needed. This is a placeholder for the add/edit product form.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-accent-blue hover:bg-blue-600 text-navy font-bold py-2 rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
