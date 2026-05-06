// Generate cache key from category and answers
// Answers are sorted alphabetically before hashing for consistency

export function generateCacheKey(category, answers) {
  const sorted = Object.keys(answers)
    .sort()
    .map(k => `${k}:${answers[k]}`)
    .join('|')
  const hash = simpleHash(sorted)
  return `rec:${category}:${hash}`
}

// Simple djb2 hash function
function simpleHash(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return Math.abs(hash).toString(16)
}
