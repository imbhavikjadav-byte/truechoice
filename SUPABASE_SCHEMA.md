# TrueChoice Product Database Schema

This document describes the Supabase PostgreSQL schema for TrueChoice.

## Table: products

```sql
CREATE TYPE product_category AS ENUM ('laptop', 'mobile', 'earphone', 'other');

CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category product_category NOT NULL DEFAULT 'laptop',
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  affiliate_link TEXT NOT NULL,
  amazon_rating DECIMAL(2,1),
  specs JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
```

## Specs Format by Category

### Laptops
```json
{
  "processor": "Intel Core i5-12th Gen",
  "ram": "16GB",
  "storage": "512GB SSD",
  "display": "15.6 inch FHD",
  "battery": "8 hours",
  "weight": "1.8kg",
  "os": "Windows 11",
  "graphics": "Intel Iris Xe"
}
```

### Mobiles
```json
{
  "processor": "Snapdragon 8 Gen 2",
  "ram": "8GB",
  "storage": "256GB",
  "camera": "50MP main",
  "battery": "4500mAh",
  "display": "6.1 inch AMOLED",
  "os": "Android 14"
}
```

### Earphones
```json
{
  "driver_size": "10mm",
  "frequency_response": "20Hz-20kHz",
  "battery": "6 hours",
  "connectivity": "Bluetooth 5.2",
  "noise_cancellation": "Active",
  "impedance": "32 Ohm"
}
```

## Setup Instructions

1. Create a new Supabase project at supabase.com
2. Go to SQL Editor
3. Copy and paste the schema above
4. Get your API credentials from Project Settings → API
5. Add to .env.local:
   - VITE_SUPABASE_URL=your_project_url
   - VITE_SUPABASE_ANON_KEY=your_anon_key
