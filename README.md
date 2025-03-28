# Football Tracker

A modern web application for tracking football matches, player statistics, and team rankings. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- Track individual player matches and statistics
- Create and manage teams for team-based competitions
- View comprehensive player and team rankings
- Filter match history by player or team
- Mobile-responsive design for on-the-go score tracking

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: [Your deployment platform]

## Serverless Functions

This project uses Vercel's serverless functions to securely handle database operations. All database operations are performed server-side, enhancing security by not exposing database credentials to the client.

### API Endpoints

The following API endpoints are available:

- `/api/players` - CRUD operations for players
- `/api/matches` - CRUD operations for individual matches
- `/api/teams` - CRUD operations for teams
- `/api/team-matches` - CRUD operations for team matches
- `/api/stats` - Retrieve player and team statistics

### Environment Configuration

For development with serverless functions, update your `.env` file with both client-side and server-side environment variables:

```bash
# Client-side variables (used by the Vite app)
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Server-side variables (used by the serverless functions)
SUPABASE_URL="YOUR_SUPABASE_URL"
SUPABASE_SERVICE_ROLE_KEY="YOUR_SUPABASE_SERVICE_ROLE_KEY"
```

The `SUPABASE_SERVICE_ROLE_KEY` is available in your Supabase project settings. This key has elevated permissions and should be kept secure.

### Local Development

When developing locally, the frontend will use `http://localhost:3000` as the API base URL. In production, it will use the same origin as the application.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository

   ```
   git clone [your-repo-url]
   cd football-tracker
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up environment variables

   ```
   cp .env.example .env
   ```

   Then edit `.env` with your Supabase credentials.

4. Run the development server

   ```
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

### Database Setup

This project uses Supabase migrations to set up the database schema. To apply the migrations:

1. Install Supabase CLI
2. Link your project: `supabase link --project-ref your-project-ref`
3. Apply migrations: `supabase db push`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License] - See the LICENSE file for details.

## Vercel Deployment

This project is designed to be deployed on Vercel. To deploy your app:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set up the required environment variables in Vercel:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (from API settings)

## Troubleshooting API Issues

If you encounter the error `SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON`, this indicates that your Supabase connection is not properly configured. Follow these steps to fix it:

1. Verify that your environment variables are correctly set in the Vercel dashboard:

   - Go to your project in the Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Ensure both `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set with the correct values
   - The URL should look like `https://your-project-id.supabase.co`
   - The key should be the service role key (not the anon key) from the Supabase API settings

2. Redeploy your application after setting the environment variables:

   - In the Vercel dashboard, go to Deployments
   - Click "Redeploy" on your latest deployment

3. Test with the verification endpoint:

   - Visit `https://your-vercel-domain.vercel.app/api/test`
   - This should return a JSON response with `"supabaseConfigured": true`

4. For local development:
   - Copy `.env.example` to `.env`
   - Add your actual Supabase credentials
   - Run `npm run verify-supabase` to test your connection

Remember that the service role key has elevated permissions and should be kept secure. Never expose it in client-side code.

---
