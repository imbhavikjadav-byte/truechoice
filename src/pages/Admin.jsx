import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api'

const SPEC_FIELDS = {
  laptop: [
    { key: 'processor', label: 'Processor', required: true },
    { key: 'ram', label: 'RAM', required: true },
    { key: 'storage', label: 'Storage', required: true },
    { key: 'display', label: 'Display', required: true },
    { key: 'battery', label: 'Battery', required: true },
    { key: 'weight', label: 'Weight', required: true },
    { key: 'os', label: 'OS', required: true },
    { key: 'graphics', label: 'Graphics', required: false },
  ],
  mobile: [
    { key: 'processor', label: 'Processor', required: true },
    { key: 'ram', label: 'RAM', required: true },
    { key: 'storage', label: 'Storage', required: true },
    { key: 'camera', label: 'Camera', required: true },
    { key: 'battery', label: 'Battery', required: true },
    { key: 'display', label: 'Display', required: true },
    { key: 'os', label: 'OS', required: true },
  ],
  earphone: [
    { key: 'driver_size', label: 'Driver Size', required: true },
    { key: 'frequency_response', label: 'Frequency Response', required: true },
    { key: 'battery', label: 'Battery', required: true },
    { key: 'connectivity', label: 'Connectivity', required: true },
    { key: 'noise_cancellation', label: 'Noise Cancellation', required: true },
  ],
  other: [],
}

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
  const [formMessage, setFormMessage] = useState({ type: '', text: '' })
  const [formSubmitting, setFormSubmitting] = useState(false)

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

  const handleOpenForm = (product = null) => {
    setEditingProduct(product)
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: '',
        brand: '',
        category: 'laptop',
        price: '',
        amazon_rating: '',
        image_url: '',
        affiliate_link: '',
        is_active: true,
        specs: {},
      })
    }
    setFormMessage({ type: '', text: '' })
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
    setFormData({})
    setFormMessage({ type: '', text: '' })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSpecChange = (specKey, value) => {
    setFormData({
      ...formData,
      specs: {
        ...formData.specs,
        [specKey]: value,
      },
    })
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormSubmitting(true)
    setFormMessage({ type: '', text: '' })

    try {
      // Validate required fields
      if (!formData.name || !formData.brand || !formData.category || !formData.price) {
        setFormMessage({ type: 'error', text: 'Please fill in all required fields' })
        setFormSubmitting(false)
        return
      }

      if (!formData.image_url || !formData.affiliate_link) {
        setFormMessage({ type: 'error', text: 'Image URL and Affiliate Link are required' })
        setFormSubmitting(false)
        return
      }

      // Validate specs
      const requiredSpecs = SPEC_FIELDS[formData.category].filter(s => s.required)
      for (const spec of requiredSpecs) {
        if (!formData.specs[spec.key]) {
          setFormMessage({ type: 'error', text: `${spec.label} is required` })
          setFormSubmitting(false)
          return
        }
      }

      const submitData = {
        ...formData,
        price: parseInt(formData.price),
        amazon_rating: formData.amazon_rating ? parseFloat(formData.amazon_rating) : null,
      }

      if (editingProduct) {
        await updateProduct(editingProduct.id, submitData, adminPassword)
        setFormMessage({ type: 'success', text: 'Product updated successfully!' })
      } else {
        await addProduct(submitData, adminPassword)
        setFormMessage({ type: 'success', text: 'Product added successfully!' })
      }

      setTimeout(() => {
        handleCloseForm()
        fetchProducts(adminPassword)
      }, 1500)
    } catch (error) {
      console.error('Error submitting form:', error)
      setFormMessage({ type: 'error', text: error.message || 'Error saving product' })
    } finally {
      setFormSubmitting(false)
    }
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
              onClick={() => handleOpenForm()}
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
                            onClick={() => handleOpenForm(product)}
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

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-navy/95 border border-accent-blue/30 rounded-lg p-8 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-display font-bold text-light-bg mb-6">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>

            {/* Message */}
            {formMessage.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  formMessage.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }`}
              >
                {formMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleFormChange}
                    placeholder="e.g., ASUS ROG Strix G15"
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand || ''}
                    onChange={handleFormChange}
                    placeholder="e.g., ASUS"
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category || 'laptop'}
                    onChange={handleFormChange}
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg focus:outline-none focus:border-accent-blue"
                  >
                    <option value="laptop">Laptop</option>
                    <option value="mobile">Mobile</option>
                    <option value="earphone">Earphone</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleFormChange}
                    placeholder="e.g., 75000"
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Amazon Rating (optional)</label>
                  <input
                    type="number"
                    name="amazon_rating"
                    value={formData.amazon_rating || ''}
                    onChange={handleFormChange}
                    placeholder="e.g., 4.3"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Status</label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active !== false}
                      onChange={handleFormChange}
                      className="w-4 h-4"
                    />
                    <span className="text-light-bg">{formData.is_active !== false ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>
              </div>

              {/* URLs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Product Image URL *</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={handleFormChange}
                    placeholder="https://..."
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-light-bg/70 text-sm mb-2">Affiliate Link *</label>
                  <input
                    type="url"
                    name="affiliate_link"
                    value={formData.affiliate_link || ''}
                    onChange={handleFormChange}
                    placeholder="https://amazon.in/..."
                    className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Specs */}
              {SPEC_FIELDS[formData.category || 'laptop'].length > 0 && (
                <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-lg p-4">
                  <h3 className="text-light-bg font-semibold mb-4">Product Specs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SPEC_FIELDS[formData.category || 'laptop'].map((spec) => (
                      <div key={spec.key}>
                        <label className="block text-light-bg/70 text-sm mb-2">
                          {spec.label} {spec.required ? '*' : '(optional)'}
                        </label>
                        <input
                          type="text"
                          value={formData.specs?.[spec.key] || ''}
                          onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                          placeholder={`Enter ${spec.label.toLowerCase()}`}
                          className="w-full bg-navy/30 border border-accent-blue/30 rounded-lg px-4 py-2 text-light-bg placeholder-light-bg/30 focus:outline-none focus:border-accent-blue"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 bg-navy/50 border border-accent-blue/30 text-light-bg hover:bg-navy/70 font-semibold py-2 rounded-lg transition-all"
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent-blue hover:bg-blue-600 text-navy font-bold py-2 rounded-lg transition-all disabled:opacity-50"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
