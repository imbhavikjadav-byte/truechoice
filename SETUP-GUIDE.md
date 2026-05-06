# TrueChoice Setup Guide

## Environment Configuration

### Step 1: Create .env.local
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Step 2: Get Your Credentials

#### Anthropic API
1. Go to https://console.anthropic.com
2. Create an API key
3. Add to .env.local: `VITE_ANTHROPIC_API_KEY=your_key`

#### Supabase
1. Go to https://supabase.com and create a project
2. Go to Project Settings → API
3. Copy Project URL and anon key
4. Create the products table using SQL from SUPABASE_SCHEMA.md
5. Add to .env.local:
   - `VITE_SUPABASE_URL=your_url`
   - `VITE_SUPABASE_ANON_KEY=your_key`

#### Upstash Redis
1. Go to https://upstash.com and create a Redis database
2. Go to Details tab
3. Add to .env.local:
   - `UPSTASH_REDIS_REST_URL=your_url`
   - `UPSTASH_REDIS_REST_TOKEN=your_token`

#### Admin Password
1. Choose a strong password
2. Add to .env.local: `VITE_ADMIN_PASSWORD=your_password`

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run Locally
```bash
npm install -g vercel
vercel dev
```

Visit http://localhost:3000

## Deployment

### GitHub
```bash
git init
git add .
git commit -m "Initial TrueChoice setup"
git remote add origin https://github.com/YOUR_USERNAME/truechoice.git
git push -u origin main
```

### Vercel
1. Go to vercel.com
2. Connect your GitHub repository
3. Add all environment variables from .env.local
4. Deploy

Your app will be live at truechoice.vercel.app

## Adding Your First Products

1. Visit yourapp.vercel.app/admin
2. Enter your admin password
3. Click "+ Add Product"
4. Fill in product details:
   - Name, Brand, Price
   - Amazon image URL and affiliate link
   - Category and specs
5. Click Save

Repeat for 20-25 laptops to get good recommendations.

## Testing

1. Go to home page
2. Click "Find My Laptop"
3. Answer all 5 questions
4. See recommendations appear
5. Check admin console to add/edit products

## Troubleshooting

### API calls returning errors
- Check .env.local variables are correct
- Verify Supabase table exists (see SUPABASE_SCHEMA.md)
- Check Anthropic API key is valid

### Cache not working
- Verify Upstash credentials
- Check Redis connection in browser console

### Admin console not loading
- Verify VITE_ADMIN_PASSWORD is set
- Check browser console for errors

## Next Steps

- Add more product categories via admin console
- Customize questions for each category
- Implement advanced caching strategies
- Add analytics and tracking
- Set up domain (truechoice.in)
