# Football Tracker API Server

This is the backend API server for the Football Tracker application. It provides RESTful endpoints for managing players, teams, and matches.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:

   ```
   cp .env.example .env
   ```

3. Update the `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Development

Run the development server with hot reloading:

```
npm run dev
```

The server will start on http://localhost:3001.

## Production

Build the TypeScript project:

```
npm run build
```

Start the production server:

```
npm start
```

## API Endpoints

### Players

- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player
- `GET /api/players/stats` - Get player statistics

### Teams

- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `GET /api/teams/stats` - Get team statistics

### Matches

- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get match by ID
- `GET /api/matches/month/:year/:month` - Get matches by month
- `POST /api/matches` - Create a new match
- `PUT /api/matches/:id` - Update a match
- `DELETE /api/matches/:id` - Delete a match
- `GET /api/matches/active-months` - Get months with matches

## Deployment on Vercel

1. Create a new project on Vercel
2. Link to your repository
3. Set the following:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add environment variables from your `.env` file
5. Deploy!
