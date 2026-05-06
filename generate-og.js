import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'

const W = 1200
const H = 630

// Layout: icon left, wordmark right, both vertically centered at midY
const midY = H / 2

// Total logo width estimation: icon(80) + gap(24) + "TrueChoice"(~460 at 80px) = ~564
const totalW = 564
const startX = (W - totalW) / 2

const iconR = 40
const iconCX = startX + iconR          // center of circle
const iconCY = midY

const wordX = startX + iconR * 2 + 24  // text starts after icon + gap
const wordY = midY + 28                 // baseline aligned to circle center

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2563EB"/>
      <stop offset="100%" stop-color="#7C3AED"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0E1420"/>

  <!-- Icon: gradient circle outline -->
  <circle cx="${iconCX}" cy="${iconCY}" r="${iconR}" fill="none" stroke="url(#grad)" stroke-width="3.5"/>

  <!-- Icon: gradient checkmark -->
  <polyline
    points="${iconCX - 18},${iconCY + 2} ${iconCX - 4},${iconCY + 14} ${iconCX + 20},${iconCY - 16}"
    fill="none"
    stroke="url(#grad)"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Wordmark: True (white, light) -->
  <text
    x="${wordX}"
    y="${wordY}"
    text-anchor="start"
    font-family="Georgia, serif"
    font-size="80"
    font-weight="300"
    fill="#F0F4FF"
  >True</text>

  <!-- Wordmark: Choice (gradient, bold) -->
  <text
    x="${wordX + 178}"
    y="${wordY}"
    text-anchor="start"
    font-family="Georgia, serif"
    font-size="80"
    font-weight="700"
    fill="url(#textGrad)"
  >Choice</text>
</svg>
`

const buf = Buffer.from(svg)

await sharp(buf)
  .resize(W, H)
  .png()
  .toFile('public/og-image.png')

console.log('✓ public/og-image.png generated (1200×630)')
