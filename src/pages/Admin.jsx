import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api'
import Logo from '../components/Logo'
import LogoHeader from '../components/LogoHeader'
import { useToast, ToastContainer } from '../components/ToastNotification'

const COOKIE_NAME = 'tc_admin_auth'
const COOKIE_TTL = 60 * 60 * 24 // 24 hours in seconds

function setAuthCookie() {
  document.cookie = `${COOKIE_NAME}=1; max-age=${COOKIE_TTL}; path=/; SameSite=Strict`
}

function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Strict`
}

function hasAuthCookie() {
  return document.cookie.split(';').some(c => c.trim().startsWith(`${COOKIE_NAME}=1`))
}

const SPEC_FIELDS = {
  laptop: [
    { key: 'processor', label: 'Processor', required: true, placeholder: 'e.g. Intel Core i5 13th Gen' },
    { key: 'ram', label: 'RAM', required: true, placeholder: 'e.g. 16GB DDR5' },
    { key: 'storage', label: 'Storage', required: true, placeholder: 'e.g. 512GB NVMe SSD' },
    { key: 'display', label: 'Display', required: true, placeholder: 'e.g. 15.6" FHD IPS 144Hz' },
    { key: 'battery', label: 'Battery Life', required: true, placeholder: 'e.g. 8 hours typical use' },
    { key: 'weight', label: 'Weight', required: true, placeholder: 'e.g. 1.8 kg' },
    { key: 'os', label: 'Operating System', required: true, placeholder: 'e.g. Windows 11 Home' },
    { key: 'graphics', label: 'Graphics Card', required: false, placeholder: 'e.g. NVIDIA RTX 4060 8GB' },
  ],
  mobile: [
    { key: 'processor', label: 'Processor', required: true, placeholder: 'e.g. Snapdragon 8 Gen 3' },
    { key: 'ram', label: 'RAM', required: true, placeholder: 'e.g. 12GB LPDDR5' },
    { key: 'storage', label: 'Storage', required: true, placeholder: 'e.g. 256GB UFS 3.1' },
    { key: 'camera', label: 'Camera Setup', required: true, placeholder: 'e.g. 50MP + 12MP + 10MP triple' },
    { key: 'battery', label: 'Battery & Charging', required: true, placeholder: 'e.g. 5000mAh, 67W fast charge' },
    { key: 'display', label: 'Display', required: true, placeholder: 'e.g. 6.7" AMOLED 120Hz' },
    { key: 'os', label: 'Operating System', required: true, placeholder: 'e.g. Android 14' },
  ],
  smartwatch: [
    { key: 'display', label: 'Display', required: true, placeholder: 'e.g. 1.9" Always-On AMOLED' },
    { key: 'battery', label: 'Battery Life', required: true, placeholder: 'e.g. Up to 18 hours typical use' },
    { key: 'health_sensors', label: 'Health Sensors', required: true, placeholder: 'e.g. ECG, SpO2, Heart Rate, Skin Temp' },
    { key: 'connectivity', label: 'Connectivity', required: true, placeholder: 'e.g. Bluetooth 5.3, Wi-Fi, NFC' },
    { key: 'compatibility', label: 'Phone Compatibility', required: true, placeholder: 'e.g. iPhone only / Android / Both' },
    { key: 'water_resistance', label: 'Water Resistance', required: false, placeholder: 'e.g. 50 metres / 5 ATM / IP68' },
  ],
  other: [],
}

const TAG_FIELDS = {
  laptop: [
    {
      key: 'use_case',
      label: 'Best For (Use Cases)',
      hint: 'Select all that apply — maps to Q1 of the questionnaire',
      type: 'multiselect',
      options: ['College & Study', 'Office & Work', 'Gaming', 'Video Editing & Design'],
    },
    {
      key: 'priority',
      label: 'Priority Strength',
      hint: 'What does this laptop do best — maps to Q3',
      type: 'select',
      options: ['Lightweight & Portable', 'Balanced', 'Maximum Performance'],
    },
    {
      key: 'battery',
      label: 'Battery Life Category',
      hint: 'How good is the battery — maps to Q5',
      type: 'select',
      options: ['Very Important', 'Somewhat', 'Not Important'],
    },
  ],
  mobile: [
    {
      key: 'use_case',
      label: 'Best For (Use Cases)',
      hint: 'Select all that apply — maps to Q1 of the questionnaire',
      type: 'multiselect',
      options: ['Everyday Use', 'Photography', 'Gaming', 'Business'],
    },
    {
      key: 'priority',
      label: 'Primary Strength',
      hint: 'What does this phone excel at — maps to Q3',
      type: 'select',
      options: ['Camera', 'Battery Life', 'Performance', 'Display'],
    },
    {
      key: 'storage',
      label: 'Storage Tier',
      hint: 'Storage capacity this phone offers — maps to Q5',
      type: 'select',
      options: ['128GB', '256GB', '512GB+'],
    },
  ],
  smartwatch: [
    {
      key: 'use_case',
      label: 'Best For (Use Cases)',
      hint: 'Select all that apply — maps to Q1 of the questionnaire',
      type: 'multiselect',
      options: ['Fitness Tracking', 'Health Monitoring', 'Notifications', 'Style'],
    },
    {
      key: 'priority',
      label: 'Primary Strength',
      hint: 'What does this watch excel at — maps to Q3',
      type: 'select',
      options: ['Battery Life', 'Health Sensors', 'Display', 'GPS & Sports'],
    },
    {
      key: 'compatibility',
      label: 'Phone Compatibility',
      hint: 'Which phones does it work with — maps to Q4',
      type: 'select',
      options: ['iPhone', 'Android', 'Any'],
    },
  ],
  other: [],
}

const CATEGORY_COLORS = {
  laptop: 'bg-blue-500/20 text-blue-300',
  mobile: 'bg-green-500/20 text-green-300',
  smartwatch: 'bg-cyan-500/20 text-cyan-300',
  other: 'bg-gray-500/20 text-gray-300',
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  )
}

function ProductCardAdmin({ product, onEdit, onDelete, onToggleActive }) {
  const [imgError, setImgError] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await onToggleActive(product)
    setToggling(false)
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#1E2A45] bg-[#0E1420] overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[#2563EB] group">
      {/* Image */}
      <div className="h-40 bg-[#141B2D] flex items-center justify-center overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="18" width="48" height="32" rx="3" stroke="#8896B3" strokeWidth="2" fill="none"/>
            <rect x="12" y="22" width="40" height="24" rx="1" fill="#1E2A45"/>
            <rect x="20" y="50" width="24" height="3" fill="#8896B3"/>
            <rect x="16" y="53" width="32" height="2" rx="1" fill="#8896B3"/>
          </svg>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4">
        <h3 className="text-[#F0F4FF] font-bold text-sm mb-2 leading-snug line-clamp-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{product.name}</h3>
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="bg-[#141B2D] text-[#8896B3] text-xs px-2 py-0.5 rounded-full">{product.brand}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[product.category] || CATEGORY_COLORS.other}`}>
            {product.category}
          </span>
        </div>
        <div className="text-[#2563EB] font-bold text-lg mb-3">₹{product.price?.toLocaleString('en-IN')}</div>

        {/* Active toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
              product.is_active ? 'bg-[#10B981]' : 'bg-[#1E2A45]'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                product.is_active ? 'translate-x-4' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-[#8896B3] text-xs">{product.is_active ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-1 px-4 py-3 border-t border-[#1E2A45]">
        <button
          onClick={() => onEdit(product)}
          className="flex items-center gap-1.5 text-[#8896B3] hover:text-[#2563EB] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#141B2D] text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex items-center gap-1.5 text-[#8896B3] hover:text-[#EF4444] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#141B2D] text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
          Delete
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const navigate = useNavigate()
  const { toasts, showToast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(() => hasAuthCookie())
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
  const [imgPreviewError, setImgPreviewError] = useState(false)

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    const prev = document.title
    document.title = 'TrueChoice — Admin'
    return () => { document.title = prev }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === adminPassword) {
      setAuthCookie()
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
    setImgPreviewError(false)
    if (product) {
      setFormData({ ...product, tags: product.tags || {} })
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
        tags: {},
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
    if (name === 'category') {
      setFormData({ ...formData, category: value, tags: {} })
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }
  }

  const handleTagChange = (key, value, isMulti) => {
    const current = formData.tags || {}
    if (isMulti) {
      const existing = Array.isArray(current[key]) ? current[key] : []
      const updated = existing.includes(value)
        ? existing.filter(v => v !== value)
        : [...existing, value]
      setFormData({ ...formData, tags: { ...current, [key]: updated } })
    } else {
      setFormData({ ...formData, tags: { ...current, [key]: value } })
    }
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
        showToast('Product updated successfully!', 'success')
      } else {
        await addProduct(submitData, adminPassword)
        showToast('Product added successfully!', 'success')
      }

      handleCloseForm()
      fetchProducts(adminPassword)
    } catch (error) {
      console.error('Error submitting form:', error)
      showToast(error.message || 'Error saving product', 'error')
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
      showToast('Product deleted', 'success')
    } catch (error) {
      showToast('Error deleting product: ' + error.message, 'error')
    }
  }

  const handleToggleActive = async (product) => {
    try {
      const updated = { ...product, is_active: !product.is_active }
      await updateProduct(product.id, updated, adminPassword)
      setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p))
      showToast(`Product ${updated.is_active ? 'activated' : 'deactivated'}`, 'success')
    } catch (error) {
      showToast('Failed to update status', 'error')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col">
        <LogoHeader />
        <div className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="bg-[#0E1420] border border-[#1E2A45] rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div />
          <h1 className="text-2xl font-display font-bold text-[#F0F4FF] text-center mb-2">
            Admin Console
          </h1>
          <p className="text-[#8896B3] text-sm text-center mb-8">Manage your product catalogue</p>
          <form onSubmit={handleLogin}>
            <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-3 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] mb-4 transition-colors"
            />
            <button
              type="submit"
              className="w-full text-white font-bold py-3 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Sign In
            </button>
          </form>
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 text-[#8896B3] hover:text-[#F0F4FF] transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
        </div>
      </div>
    )
  }

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const CATEGORY_TABS = [
    { value: 'all', label: 'All' },
    { value: 'laptop', label: 'Laptops' },
    { value: 'mobile', label: 'Mobile Phones' },
    { value: 'smartwatch', label: 'Smartwatches' },
  ]

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col"
      style={{ backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.05) 0%, transparent 60%)' }}
    >
      <ToastContainer toasts={toasts} />

      <LogoHeader
        showBadge
        rightSlot={
          <button
            onClick={() => { clearAuthCookie(); setIsLoggedIn(false); navigate('/') }}
            className="text-[#8896B3] hover:text-[#EF4444] text-sm font-semibold border border-[#1E2A45] hover:border-[#EF4444] px-4 py-2 rounded-lg transition-all whitespace-nowrap"
          >
            🔒 Lock
          </button>
        }
      />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-8 py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-display font-bold text-[#F0F4FF] mb-1">Product Manager</h1>
            <p className="text-[#8896B3]">Manage your product catalogue across all categories</p>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8896B3]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg pl-10 pr-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/60 focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 bg-[#141B2D] p-1 rounded-lg">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    selectedCategory === tab.value
                      ? 'text-white'
                      : 'text-[#8896B3] hover:text-[#F0F4FF]'
                  }`}
                  style={selectedCategory === tab.value
                    ? { background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }
                    : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Add Product Button */}
            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(37,99,235,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add Product
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="flex items-center gap-3 text-[#8896B3]">
                <Spinner /> Loading products...
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-[#1E2A45] rounded-2xl bg-[#0E1420]">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mb-4 text-[#8896B3]">
                <rect x="8" y="16" width="48" height="36" rx="4" stroke="#8896B3" strokeWidth="2" fill="none"/>
                <path d="M8 28h48" stroke="#8896B3" strokeWidth="2"/>
                <path d="M24 40h16" stroke="#8896B3" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="text-[#F0F4FF] font-bold text-xl mb-2">No products yet</h3>
              <p className="text-[#8896B3] mb-6">Add your first product to get started</p>
              <button
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 text-white font-bold px-5 py-2.5 rounded-lg"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Add Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCardAdmin
                  key={product.id}
                  product={product}
                  onEdit={handleOpenForm}
                  onDelete={handleDeleteProduct}
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto md:p-4 p-0">
          <div className="bg-[#0E1420] border border-[#1E2A45] rounded-2xl w-full max-w-2xl md:my-8 md:rounded-2xl rounded-none flex flex-col max-h-screen md:max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E2A45]">
              <h2 className="text-xl font-display font-bold text-[#F0F4FF]">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-[#8896B3] hover:text-[#F0F4FF] transition-colors p-1 rounded-lg hover:bg-[#141B2D]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Modal Body (scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Inline error message */}
              {formMessage.text && formMessage.type === 'error' && (
                <div className="mb-5 p-3 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-sm">
                  {formMessage.text}
                </div>
              )}

              <form id="product-form" onSubmit={handleSubmitForm} className="space-y-5">
                {/* Product Name — full width */}
                <div>
                  <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleFormChange}
                    placeholder="e.g., ASUS ROG Strix G15"
                    className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                    required
                  />
                </div>

                {/* Brand | Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Brand *</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand || ''}
                      onChange={handleFormChange}
                      placeholder="e.g., ASUS"
                      className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Category *</label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category || 'laptop'}
                        onChange={handleFormChange}
                        className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg pl-4 pr-10 py-2.5 text-[#F0F4FF] focus:outline-none focus:border-[#2563EB] transition-colors appearance-none"
                      >
                        <option value="laptop">Laptop</option>
                        <option value="mobile">Mobile Phone</option>
                        <option value="smartwatch">Smartwatch</option>
                        <option value="other">Other</option>
                      </select>
                      <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8896B3" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Price | Amazon Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price || ''}
                      onChange={handleFormChange}
                      placeholder="e.g., 75000"
                      className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Amazon Rating</label>
                    <input
                      type="number"
                      name="amazon_rating"
                      value={formData.amazon_rating || ''}
                      onChange={handleFormChange}
                      placeholder="e.g., 4.3"
                      step="0.1" min="0" max="5"
                      className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                    />
                  </div>
                </div>

                {/* Image URL with live preview */}
                <div>
                  <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Product Image URL *</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url || ''}
                    onChange={(e) => { setImgPreviewError(false); handleFormChange(e) }}
                    placeholder="https://..."
                    className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                    required
                  />
                  {formData.image_url && !imgPreviewError && (
                    <div className="mt-2 h-24 bg-[#141B2D] rounded-lg overflow-hidden flex items-center justify-center border border-[#1E2A45]">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="h-full object-contain"
                        onError={() => setImgPreviewError(true)}
                      />
                    </div>
                  )}
                </div>

                {/* Affiliate Link */}
                <div>
                  <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">Affiliate Link *</label>
                  <input
                    type="url"
                    name="affiliate_link"
                    value={formData.affiliate_link || ''}
                    onChange={handleFormChange}
                    placeholder="https://amazon.in/..."
                    className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                    required
                  />
                </div>

                {/* Status toggle */}
                <div className="flex items-center justify-between bg-[#141B2D] rounded-lg px-4 py-3 border border-[#1E2A45]">
                  <div>
                    <div className="text-[#F0F4FF] text-sm font-semibold">Status</div>
                    <div className="text-[#8896B3] text-xs">{formData.is_active !== false ? 'Active — visible to users' : 'Inactive — hidden from users'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.is_active !== false ? 'bg-[#10B981]' : 'bg-[#1E2A45]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        formData.is_active !== false ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Matching Tags */}
                {TAG_FIELDS[formData.category || 'laptop']?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-px bg-[#1E2A45]" />
                      <span className="text-[#8896B3] text-xs uppercase tracking-wider">Matching Tags</span>
                      <div className="flex-1 h-px bg-[#1E2A45]" />
                    </div>
                    <p className="text-[#8896B3] text-xs mb-4 text-center">These must match the exact questionnaire answer values so Claude can match this product to the right users.</p>
                    <div className="space-y-5">
                      {TAG_FIELDS[formData.category || 'laptop'].map((field) => {
                        const currentTags = formData.tags || {}
                        return (
                          <div key={field.key}>
                            <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-0.5">{field.label}</label>
                            <p className="text-[#8896B3]/50 text-xs mb-2">{field.hint}</p>
                            <div className="flex flex-wrap gap-2">
                              {field.options.map((option) => {
                                const isSelected = field.type === 'multiselect'
                                  ? (Array.isArray(currentTags[field.key]) && currentTags[field.key].includes(option))
                                  : currentTags[field.key] === option
                                return (
                                  <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleTagChange(field.key, option, field.type === 'multiselect')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                      isSelected
                                        ? 'border-[#2563EB] bg-[#2563EB]/20 text-[#F0F4FF]'
                                        : 'border-[#1E2A45] bg-[#141B2D] text-[#8896B3] hover:border-[#2563EB]/50 hover:text-[#F0F4FF]'
                                    }`}
                                  >
                                    {option}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Specs Divider */}
                {SPEC_FIELDS[formData.category || 'laptop'].length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-[#1E2A45]" />
                      <span className="text-[#8896B3] text-xs uppercase tracking-wider">Specifications</span>
                      <div className="flex-1 h-px bg-[#1E2A45]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {SPEC_FIELDS[formData.category || 'laptop'].map((spec) => (
                        <div key={spec.key} className={spec.key === 'os' && formData.category === 'mobile' ? 'md:col-span-2' : ''}>
                          <label className="block text-[#8896B3] text-xs uppercase tracking-wider mb-2">
                            {spec.label} {spec.required ? '*' : <span className="normal-case">(optional)</span>}
                          </label>
                          <input
                            type="text"
                            value={formData.specs?.[spec.key] || ''}
                            onChange={(e) => handleSpecChange(spec.key, e.target.value)}
                            placeholder={spec.placeholder || `e.g. ${spec.label}`}
                            className="w-full bg-[#141B2D] border border-[#1E2A45] rounded-lg px-4 py-2.5 text-[#F0F4FF] placeholder-[#8896B3]/50 focus:outline-none focus:border-[#2563EB] transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer — sticky */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-[#1E2A45] bg-[#0E1420] rounded-b-2xl">
              <button
                type="button"
                onClick={handleCloseForm}
                className="flex-1 border border-[#1E2A45] text-[#8896B3] hover:text-[#F0F4FF] hover:border-[#8896B3] font-semibold py-2.5 rounded-lg transition-all"
                disabled={formSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                className="flex-1 flex items-center justify-center gap-2 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                disabled={formSubmitting}
              >
                {formSubmitting ? (
                  <><Spinner /> Saving...</>
                ) : (
                  editingProduct ? 'Update Product' : 'Save Product'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
