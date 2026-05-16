# 🔥 Resume Roaster

> Upload your resume. Get roasted. Get hired.

A brutally honest AI-powered resume feedback tool built with Next.js, powered by OpenRouter's free Llama 3.3 70B model.

---

## 🚀 Deploy to Vercel (5 minutes)

### Step 1 — Get a free OpenRouter API key
1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to **Keys** → **Create Key**
4. Copy your API key

### Step 2 — Deploy to Vercel

**Option A: One-click deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Option B: Via CLI**
```bash
npm install -g vercel
vercel
```

**Option C: Via GitHub**
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Add environment variables (see below)
5. Click Deploy!

### Step 3 — Add Environment Variables in Vercel

In your Vercel project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL (e.g. `https://resume-roaster.vercel.app`) |

---

## 💻 Run Locally

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local and add your OPENROUTER_API_KEY

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenRouter API → Llama 3.3 70B (free tier)
- **Hosting**: Vercel (free tier)
- **Total cost**: $0

---

## 📁 Project Structure

```
resume-roaster/
├── app/
│   ├── api/roast/route.ts   # API route — calls OpenRouter
│   ├── globals.css          # Custom styles & animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── UploadZone.tsx       # File upload + paste input
│   ├── LoadingRoast.tsx     # Loading animation
│   └── RoastResults.tsx     # Results display
└── .env.example             # Environment variable template
```

---

## ⚠️ Notes

- **PDF extraction**: For best results, use "Paste Text" mode for PDFs. File upload works for .txt files perfectly.
- **Rate limits**: OpenRouter free tier has rate limits. For high traffic, consider a paid plan (~$0.003/request).
- **Privacy**: Resumes are never stored — analysis is real-time only.
