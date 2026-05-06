// Frontend API call helpers
const API_BASE = '/api'

export async function getRecommendations(category, answers) {
  try {
    const response = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, answers }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    throw error
  }
}

export async function getProducts(category, adminPassword) {
  try {
    const response = await fetch(`${API_BASE}/admin/get-products?category=${category}`, {
      headers: {
        'x-admin-password': adminPassword,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function addProduct(productData, adminPassword) {
  try {
    const response = await fetch(`${API_BASE}/admin/add-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
      },
      body: JSON.stringify(productData),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export async function updateProduct(productId, productData, adminPassword) {
  try {
    const response = await fetch(`${API_BASE}/admin/update-product`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
      },
      body: JSON.stringify({ id: productId, ...productData }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function deleteProduct(productId, adminPassword) {
  try {
    const response = await fetch(`${API_BASE}/admin/delete-product`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': adminPassword,
      },
      body: JSON.stringify({ id: productId }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}
