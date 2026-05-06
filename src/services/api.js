// Frontend API call helpers
const API_BASE = '/api'

const MOCK_RECOMMENDATIONS = {
  laptop: [
    {
      id: 'mock-1', name: 'Dell Inspiron 15', brand: 'Dell', price: 55000,
      image_url: 'https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.3, match_score: 96, is_best_pick: true,
      reasoning: 'Great all-rounder for your needs and budget.',
      specs: { processor: 'Intel i5 12th Gen', ram: '16GB', storage: '512GB SSD', display: '15.6 inch FHD', battery: '8 hours', weight: '1.8kg', os: 'Windows 11' }
    },
    {
      id: 'mock-2', name: 'HP Pavilion 15', brand: 'HP', price: 48000,
      image_url: 'https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.1, match_score: 88, is_best_pick: false,
      reasoning: 'Reliable and well-priced for everyday use.',
      specs: { processor: 'Intel i5 12th Gen', ram: '8GB', storage: '512GB SSD', display: '15.6 inch FHD', battery: '7 hours', weight: '1.7kg', os: 'Windows 11' }
    },
    {
      id: 'mock-3', name: 'Lenovo IdeaPad Slim 3', brand: 'Lenovo', price: 35000,
      image_url: 'https://m.media-amazon.com/images/I/71TPda7cwUL._SX679_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.0, match_score: 82, is_best_pick: false,
      reasoning: 'Best budget option with solid performance.',
      specs: { processor: 'AMD Ryzen 5', ram: '8GB', storage: '256GB SSD', display: '15.6 inch FHD', battery: '9 hours', weight: '1.6kg', os: 'Windows 11' }
    }
  ],
  mobile: [
    {
      id: 'mock-mob-1', name: 'Samsung Galaxy S24', brand: 'Samsung', price: 74999,
      image_url: 'https://m.media-amazon.com/images/I/71NS2RsGFFL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.5, match_score: 95, is_best_pick: true,
      reasoning: 'Flagship performance with exceptional camera and AI features perfect for power users.',
      specs: { processor: 'Snapdragon 8 Gen 3', ram: '8GB', storage: '256GB', camera: '50MP triple', battery: '4000mAh 25W', display: '6.2" AMOLED 120Hz', os: 'Android 14' }
    },
    {
      id: 'mock-mob-2', name: 'OnePlus 12R', brand: 'OnePlus', price: 39999,
      image_url: 'https://m.media-amazon.com/images/I/61xqpIioJeL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.4, match_score: 88, is_best_pick: false,
      reasoning: 'Best value flagship with fastest charging and smooth 120Hz display.',
      specs: { processor: 'Snapdragon 8 Gen 2', ram: '16GB', storage: '256GB', camera: '50MP triple', battery: '5500mAh 100W', display: '6.78" AMOLED 120Hz', os: 'Android 14' }
    },
    {
      id: 'mock-mob-3', name: 'Poco X6 Pro', brand: 'Poco', price: 26999,
      image_url: 'https://m.media-amazon.com/images/I/61Wfb8QFQKL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.3, match_score: 81, is_best_pick: false,
      reasoning: 'Top gaming performance at mid-range price with 144Hz display.',
      specs: { processor: 'Dimensity 8300-Ultra', ram: '12GB', storage: '256GB', camera: '64MP triple', battery: '5000mAh 67W', display: '6.67" AMOLED 144Hz', os: 'Android 14' }
    }
  ],
  smartwatch: [
    {
      id: 'mock-sw-1', name: 'Apple Watch Series 9', brand: 'Apple', price: 41900,
      image_url: 'https://m.media-amazon.com/images/I/71pRLsEhOUL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.7, match_score: 95, is_best_pick: true,
      reasoning: 'Best-in-class health features and seamless iPhone integration.',
      specs: { display: '1.9" Always-On OLED', battery: '18 hours', health_sensors: 'ECG, SpO2, Crash Detection', connectivity: 'Bluetooth 5.3, WiFi', compatibility: 'iPhone only', water_resistance: '50m' }
    },
    {
      id: 'mock-sw-2', name: 'Samsung Galaxy Watch 6', brand: 'Samsung', price: 28999,
      image_url: 'https://m.media-amazon.com/images/I/71KFqJt+lJL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.4, match_score: 87, is_best_pick: false,
      reasoning: 'Best Android smartwatch with advanced health monitoring and AMOLED display.',
      specs: { display: '1.5" Super AMOLED', battery: '40 hours', health_sensors: 'ECG, Blood Pressure, BioActive', connectivity: 'Bluetooth 5.3, WiFi, NFC', compatibility: 'Android', water_resistance: '5 ATM + IP68' }
    },
    {
      id: 'mock-sw-3', name: 'Garmin Forerunner 255', brand: 'Garmin', price: 31990,
      image_url: 'https://m.media-amazon.com/images/I/51DWVczFeSL._SX522_.jpg',
      affiliate_link: 'https://amazon.in', amazon_rating: 4.5, match_score: 82, is_best_pick: false,
      reasoning: 'Exceptional 14-day battery and GPS accuracy for serious fitness enthusiasts.',
      specs: { display: '1.3" MIP Display', battery: '14 days', health_sensors: 'HR, SpO2, Stress, HRV', connectivity: 'Bluetooth, GPS, ANT+', compatibility: 'iOS & Android', water_resistance: '5 ATM' }
    }
  ]
}

export async function getRecommendations(category, answers) {
  if (import.meta.env.VITE_DEV_MODE === 'true') {
    await new Promise(resolve => setTimeout(resolve, 2000))
    const recs = MOCK_RECOMMENDATIONS[category] || MOCK_RECOMMENDATIONS.laptop
    return { recommendations: recs, from_cache: false }
  }

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
