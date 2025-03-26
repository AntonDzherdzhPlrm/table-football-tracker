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
