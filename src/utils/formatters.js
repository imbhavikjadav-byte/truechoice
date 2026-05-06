// Format numbers as Indian currency (₹)
export function formatIndianPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price)
}

// Format rating for display
export function formatRating(rating) {
  return rating ? `⭐ ${rating.toFixed(1)}` : 'Not rated'
}

// Truncate text to a specific length
export function truncateText(text, length) {
  if (text.length > length) {
    return text.substring(0, length) + '...'
  }
  return text
}
