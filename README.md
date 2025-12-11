# SceneBreak AI - AI-Powered Scene Breakdown Tool

A modern web application that uses artificial intelligence to analyze film and theater scenes, extracting characters, themes, locations, and deeper insights instantly.

![SceneBreak AI](./public/og-image.png)

## Overview

SceneBreak AI is designed for screenwriters, filmmakers, directors, and drama enthusiasts who need to quickly analyze and understand screenplay scenes. Instead of manually breaking down scenes, which can be time-consuming and subjective, SceneBreak AI leverages GPT-4 AI to provide comprehensive, structured analysis in seconds.

## Features

### Core Functionality

- **AI-Powered Scene Analysis**: Powered by GPT-4, the app analyzes screenplay scenes and extracts:
  - Characters and their roles
  - Locations and settings
  - Central themes
  - Tone and mood
  - Story structure
  - Technical notes
  - Visual elements
  - Emotional arcs

- **Secure Authentication**: 
  - Email/password authentication via Supabase Auth
  - Email verification for new accounts
  - Secure session management with HTTP-only cookies
  - Password reset functionality

- **Breakdown History**:
  - Save all scene analyses to your personal library
  - Access previously analyzed scenes
  - View creation dates and past insights
  - Delete scenes you no longer need
  - Retrieve saved scenes for review or re-analysis

- **User Data Security**:
  - Row Level Security (RLS) policies ensure only users can access their own data
  - All data is encrypted and stored securely in Supabase
  - User-specific data isolation

- **Theme Support**:
  - Light and dark mode toggle
  - Automatic theme detection based on system preferences
  - Theme preference persistence across sessions

- **Professional UI**:
  - Beautiful, modern interface with Tailwind CSS and shadcn/ui
  - Responsive design for desktop and mobile
  - Smooth animations and transitions
  - Gradient backgrounds and professional styling

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with email/password
- **AI**: OpenAI GPT-4o Mini API
- **Deployment**: Vercel / Netlify
- **Theme Management**: next-themes

## Project Structure

\`\`\`
scenebreak-ai/
├── app/
│   ├── layout.tsx                 # Root layout with theme provider
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Global styles with theme variables
│   ├── api/
│   │   └── breakdown/
│   │       └── route.ts           # AI analysis endpoint
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── sign-up/
│   │   │   └── page.tsx          # Sign up page
│   │   └── sign-up-success/
│   │       └── page.tsx          # Sign up confirmation
│   └── protected/
│       ├── breakdown/
│       │   ├── page.tsx          # Main scene breakdown page
│       │   └── loading.tsx        # Loading state
│       └── history/
│           └── page.tsx          # Breakdown history page
├── components/
│   ├── theme-provider.tsx         # Theme provider wrapper
│   ├── theme-toggle.tsx           # Theme toggle button
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   ├── server.ts             # Server Supabase client
│   │   └── proxy.ts              # Proxy for auth
│   └── utils.ts                  # Utility functions
├── scripts/
│   └── 001_create_schema.sql     # Database schema migration
├── .env.local.example            # Environment variables template
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies

\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account and project
- An OpenAI API key
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd scenebreak-ai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`

4. **Set up the database**
   - Open your Supabase project
   - Go to SQL Editor
   - Create a new query
   - Copy and paste the contents of `scripts/001_create_schema.sql`
   - Run the query
   - This creates the `scenes` and `breakdowns` tables with Row Level Security policies

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open the app**
   Navigate to `http://localhost:3000` in your browser

## How to Use

### 1. Sign Up or Log In
- Click "Sign Up" on the landing page
- Enter your email and password
- Verify your email address
- Log in with your credentials

### 2. Analyze a Scene
- Click "Go to App" or navigate to the Breakdown page
- Enter the scene information:
  - Scene title
  - Scene description (context)
  - Actual scene text/dialogue
- Click "Analyze Scene"
- Wait for AI analysis to complete (usually 5-10 seconds)

### 3. View Results
The analysis provides:
- **Characters**: Main and supporting characters with descriptions
- **Locations**: Scenes and settings mentioned
- **Themes**: Central ideas and concepts
- **Tone**: Overall mood and atmosphere
- **Structure**: Beginning, middle, and end breakdown
- **Technical Notes**: Production considerations
- **Visual Elements**: Visual storytelling aspects
- **Emotional Arc**: Emotional progression

### 4. Save Breakdown
- Click "Save Breakdown" to store the analysis
- The scene is saved to your history with timestamp
- Access it later from the History page

### 5. View History
- Click "History" in the header
- See all your previously analyzed scenes
- Click "View" to re-read a breakdown
- Click the delete icon to remove a scene

### 6. Switch Themes
- Click the theme toggle button (sun/moon icon) in the header
- Choose between Light, Dark, or System preference
- Your preference is saved automatically

## Environment Variables

### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public key | Supabase Dashboard → Settings → API |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | https://platform.openai.com/account/api-keys |

### Getting Your Keys

**Supabase Keys:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click Settings → API
4. Copy `Project URL` and `anon` key

**OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API keys section
3. Click "Create new secret key"
4. Copy and save (only shown once!)

## Database Schema

### scenes table
\`\`\`sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- title: TEXT
- description: TEXT
- scene_text: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

### breakdowns table
\`\`\`sql
- id: UUID (Primary Key)
- scene_id: UUID (Foreign Key to scenes)
- user_id: UUID (Foreign Key to auth.users)
- characters: TEXT[]
- locations: TEXT[]
- themes: TEXT[]
- tone: TEXT
- structure: TEXT
- technical_notes: TEXT
- visual_elements: TEXT
- emotional_arc: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

**Row Level Security (RLS)**: All tables have RLS policies ensuring users can only access their own data.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings, go to Environment Variables
   - Add your three environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `OPENAI_API_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app is live!

### Deploy to Netlify

1. **Push to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and your repository
   - Click "Connect"

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Go to Site settings → Build & Deploy → Environment
   - Add your three environment variables

4. **Deploy**
   - Netlify automatically deploys on push
   - Your app is live!

## API Routes

### POST /api/breakdown

Analyzes a scene using OpenAI GPT-4 and returns structured breakdown data.

**Request Body:**
\`\`\`json
{
  "scene_text": "Scene dialogue and description",
  "title": "Scene Title",
  "description": "Scene context"
}
\`\`\`

**Response:**
\`\`\`json
{
  "characters": ["Character 1", "Character 2"],
  "locations": ["Location 1", "Location 2"],
  "themes": ["Theme 1", "Theme 2"],
  "tone": "Dramatic and suspenseful",
  "structure": "Exposition → Conflict → Resolution",
  "technical_notes": "Single location, dialogue-heavy",
  "visual_elements": "Close-ups on faces, minimal props",
  "emotional_arc": "Tension builds then resolves"
}
\`\`\`

## Troubleshooting

### Issue: "Could not find the 'breakdown' column"
**Solution**: Run the database migration script (`scripts/001_create_schema.sql`) in Supabase SQL Editor.

### Issue: "You exceeded your current quota" (OpenAI error)
**Solution**: 
- Check your OpenAI billing at https://platform.openai.com/account/billing/overview
- Add a valid payment method
- Check usage limits if set

### Issue: "Invalid Refresh Token" (Authentication error)
**Solution**: 
- Clear browser cookies and localStorage
- Log out and log back in
- Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly for development

### Issue: "Cannot read properties of undefined (reading 'characters')"
**Solution**: 
- Ensure the database migration has been run
- Clear browser cache and refresh
- Check that breakdowns are properly saved to the database

## Performance Optimization

- Uses Next.js server-side rendering for faster initial loads
- Implements proper caching strategies
- Optimized database queries with indexes
- Lazy loading of components
- Supabase RLS for efficient permission checking

## Security Features

- **Row Level Security**: Database-level access control
- **Secure Authentication**: Supabase Auth with email verification
- **HTTPS Only**: All communication is encrypted
- **API Key Protection**: Environment variables kept secret
- **Input Validation**: All user inputs are validated
- **XSS Protection**: React's built-in XSS prevention

## Future Enhancements

- Export breakdowns as PDF
- Batch scene analysis
- Collaboration features
- Custom analysis templates
- Integration with screenplay software
- Advanced filtering and search
- Scene comparison tool
- User dashboards and analytics

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team
- Check the [Vercel documentation](https://vercel.com/docs)
- Visit the [Next.js documentation](https://nextjs.org/docs)

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database powered by [Supabase](https://supabase.com)
- AI analysis by [OpenAI](https://openai.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Hosted on [Vercel](https://vercel.com)

---

**SceneBreak AI** - Empowering screenwriters and filmmakers with AI-powered insights.

 ## Author: Owolabi Agbabiaka
Last Updated: December 2025
