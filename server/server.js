import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS with specific options
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  credentials: false,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// CORS headers middleware - apply to all routes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "false");
  res.header("Access-Control-Max-Age", "86400");
  // Add Vary header to prevent caching issues
  res.header("Vary", "Origin, Access-Control-Request-Headers");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Base API route prefix
const API_PREFIX = "/api";

// Define a helper function for API routes
const apiRoute = (path) => `${API_PREFIX}${path}`;

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "Football Tracker API is running",
    endpoints: {
      teams: apiRoute("/teams"),
      players: apiRoute("/players"),
      matches: apiRoute("/matches"),
      teamMatches: apiRoute("/team-matches"),
    },
  });
});

// Handle OPTIONS preflight requests for all routes
app.options("*", cors(corsOptions));

// CORS test endpoint
app.get(apiRoute("/cors-test"), (req, res) => {
  const requestHeaders = {};
  for (const key in req.headers) {
    requestHeaders[key] = req.headers[key];
  }

  res.status(200).json({
    success: true,
    message: "CORS test successful!",
    timestamp: new Date().toISOString(),
    requestHeaders: requestHeaders,
    environment: {
      nodeEnv: process.env.NODE_ENV || "not set",
      port: process.env.PORT || "3001",
    },
  });
});

// Player routes
app.get(apiRoute("/players"), getPlayers);
app.get(apiRoute("/players/:id"), getPlayerById);
app.post(apiRoute("/players"), createPlayer);
app.put(apiRoute("/players/:id"), updatePlayer);
app.delete(apiRoute("/players/:id"), deletePlayer);

// Team routes
app.get(apiRoute("/teams"), getTeams);
app.get(apiRoute("/teams/:id"), getTeamById);
app.post(apiRoute("/teams"), createTeam);
app.put(apiRoute("/teams/:id"), updateTeam);
app.delete(apiRoute("/teams/:id"), deleteTeam);
app.get(apiRoute("/teams/stats"), getTeamStats);

// Match routes
app.get(apiRoute("/matches"), getMatches);
app.get(apiRoute("/matches/:id"), getMatchById);
app.get(apiRoute("/matches/month/:year/:month"), getMatchesByMonth);
app.post(apiRoute("/matches"), createMatch);
app.put(apiRoute("/matches/:id"), updateMatch);
app.delete(apiRoute("/matches/:id"), deleteMatch);
app.get(apiRoute("/matches/active-months"), getActiveMonths);

// Consolidated match endpoint
app.get(apiRoute("/matches/consolidated"), async (req, res) => {
  try {
    // Fetch all data in parallel
    const [matches, players, activeMonths] = await Promise.all([
      supabase
        .from("matches")
        .select("*, player1:player1_id(*), player2:player2_id(*)")
        .order("played_at", { ascending: false }),
      supabase.from("players").select("*"),
      getActiveMonths(),
    ]);

    // Calculate player stats based on all matches
    const { data: statsData, error: statsError } = await supabase
      .from("player_stats")
      .select("*")
      .order("points", { ascending: false });

    if (statsError) throw statsError;

    res.json({
      matches: matches.data || [],
      players: players.data || [],
      playerStats: statsData || [],
      activeMonths: activeMonths || [{ value: "all", label: "All" }],
    });
  } catch (error) {
    console.error("Error in matches consolidated:", error);
    res.status(500).json({ error: error.message });
  }
});

// Team Match routes
app.get(apiRoute("/team-matches"), getTeamMatches);
app.get(apiRoute("/team-matches/:id"), getTeamMatchById);
app.get(apiRoute("/team-matches/month/:year/:month"), getTeamMatchesByMonth);
app.post(apiRoute("/team-matches"), createTeamMatch);
app.put(apiRoute("/team-matches/:id"), updateTeamMatch);
app.delete(apiRoute("/team-matches/:id"), deleteTeamMatch);
app.get(apiRoute("/team-matches/active-months"), getTeamMatchActiveMonths);

// Consolidated team match endpoint
app.get(apiRoute("/team-matches/consolidated"), async (req, res) => {
  try {
    // Fetch all data in parallel
    const [teamMatches, teams, players, activeMonths] = await Promise.all([
      supabase
        .from("team_matches")
        .select("*, team1:team1_id(*), team2:team2_id(*)")
        .order("played_at", { ascending: false }),
      supabase.from("teams").select("*"),
      supabase.from("players").select("*"),
      getTeamMatchActiveMonths(),
    ]);

    // Calculate team stats based on all matches
    const { data: statsData, error: statsError } = await supabase
      .from("team_stats")
      .select("*")
      .order("points", { ascending: false });

    if (statsError) throw statsError;

    res.json({
      teamMatches: teamMatches.data || [],
      teams: teams.data || [],
      teamStats: statsData || [],
      players: players.data || [],
      activeMonths: activeMonths || [{ value: "all", label: "All" }],
    });
  } catch (error) {
    console.error("Error in team matches consolidated:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API base: ${API_PREFIX}`);
});
