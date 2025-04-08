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
  origin: [
    "https://table-football-tracker.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
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
  const allowedOrigins = [
    "https://table-football-tracker.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

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

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Football Tracker API is running",
    endpoints: {
      teams: "/api/teams",
      players: "/api/players",
      matches: "/api/matches",
      teamMatches: "/api/team-matches",
    },
  });
});

// Handle OPTIONS preflight requests for all routes
app.options("*", cors(corsOptions));

// Routes

// TEAM ROUTES

// Get all teams
app.get("/api/teams", async (req, res) => {
  try {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team stats
app.get("/api/teams/stats", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("team_stats")
      .select("*")
      .order("points", { ascending: false })
      .order("wins", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team by ID
app.get("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create team
app.post("/api/teams", async (req, res) => {
  try {
    const { name, emoji, players } = req.body;

    // Insert team
    const { data, error } = await supabase
      .from("teams")
      .insert([{ name, emoji }])
      .select()
      .single();

    if (error) throw error;

    // Insert team players if provided
    if (players && players.length > 0) {
      const teamPlayers = players.map((playerId) => ({
        team_id: data.id,
        player_id: playerId,
      }));

      const { error: playerError } = await supabase
        .from("team_players")
        .insert(teamPlayers);

      if (playerError) throw playerError;
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team
app.put("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, emoji, players } = req.body;

    // Update team
    const { data, error } = await supabase
      .from("teams")
      .update({ name, emoji })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update team players if provided
    if (players && players.length > 0) {
      // Delete existing players
      const { error: deleteError } = await supabase
        .from("team_players")
        .delete()
        .eq("team_id", id);

      if (deleteError) throw deleteError;

      // Insert new players
      const teamPlayers = players.map((playerId) => ({
        team_id: id,
        player_id: playerId,
      }));

      const { error: playerError } = await supabase
        .from("team_players")
        .insert(teamPlayers);

      if (playerError) throw playerError;
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete team
app.delete("/api/teams/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete team players first
    const { error: playersError } = await supabase
      .from("team_players")
      .delete()
      .eq("team_id", id);

    if (playersError) throw playersError;

    // Delete team
    const { error } = await supabase.from("teams").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PLAYER ROUTES

// Get all players
app.get("/api/players", async (req, res) => {
  try {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player stats
app.get("/api/players/stats", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .order("points", { ascending: false })
      .order("wins", { ascending: false });
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TEAM MATCH ROUTES

// Add endpoint for consolidated team matches data
app.get("/api/team-matches/consolidated", async (req, res) => {
  try {
    // Fetch all data in parallel
    const [teamMatches, teams, players, activeMonths] = await Promise.all([
      supabase
        .from("team_matches")
        .select("*, team1:team1_id(*), team2:team2_id(*)")
        .order("played_at", { ascending: false }),
      supabase.from("teams").select("*"),
      supabase.from("players").select("*"),
      getActiveTeamMatchMonths(),
    ]);

    // Calculate team stats
    const teamStats = await calculateTeamStats();

    res.json({
      teamMatches: teamMatches.data,
      teams: teams.data,
      teamStats: teamStats,
      players: players.data,
      activeMonths: activeMonths,
    });
  } catch (error) {
    console.error("Error in team matches consolidated:", error);
    res.status(500).json({ error: error.message });
  }
});

// Redirect config endpoint to consolidated for backward compatibility
app.get("/api/team-matches/config", (req, res) => {
  res.redirect("/api/team-matches/consolidated");
});

// Get active months for team matches
app.get("/api/team-matches/active-months", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("team_matches")
      .select("played_at");

    if (error) throw error;

    // Extract unique year-month combinations
    const months = new Set();
    const formattedMonths = [];

    data.forEach((match) => {
      const date = new Date(match.played_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!months.has(key)) {
        months.add(key);

        // Get month name
        const monthName = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        formattedMonths.push({
          value: key,
          label: monthName,
          year,
          month,
        });
      }
    });

    // Sort by date (newest first)
    formattedMonths.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    // Add "All" option at the beginning
    return [{ value: "all", label: "All" }, ...formattedMonths];
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team matches by month
app.get("/api/team-matches/month/:year/:month", async (req, res) => {
  try {
    const { month, year } = req.params;

    // Parse month and year to integers
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ error: "Invalid month or year format" });
    }

    // Create date range for the specified month
    const startDate = new Date(yearInt, monthInt - 1, 1).toISOString();
    const endDate = new Date(yearInt, monthInt, 0).toISOString();

    const { data, error } = await supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .gte("played_at", startDate)
      .lte("played_at", endDate)
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all team matches
app.get("/api/team-matches", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get team match by ID
app.get("/api/team-matches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Team match not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a team match
app.post("/api/team-matches", async (req, res) => {
  try {
    const { team1_id, team2_id, team1_score, team2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("team_matches")
      .insert([
        {
          team1_id,
          team2_id,
          team1_score,
          team2_score,
          played_at: played_at || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a team match
app.put("/api/team-matches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { team1_id, team2_id, team1_score, team2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("team_matches")
      .update({
        team1_id,
        team2_id,
        team1_score,
        team2_score,
        played_at,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a team match
app.delete("/api/team-matches/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("team_matches").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Team match deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MATCH ROUTES

// Add endpoint for consolidated individual matches data
app.get("/api/matches/consolidated", async (req, res) => {
  try {
    // Fetch all data in parallel
    const [matches, players, activeMonths] = await Promise.all([
      supabase
        .from("matches")
        .select("*, player1:player1_id(*), player2:player2_id(*)")
        .order("played_at", { ascending: false }),
      supabase.from("players").select("*"),
      getActiveMatchMonths(),
    ]);

    // Calculate player stats
    const playerStats = await calculatePlayerStats();

    res.json({
      matches: matches.data,
      players: players.data,
      playerStats: playerStats,
      activeMonths: activeMonths,
    });
  } catch (error) {
    console.error("Error in matches consolidated:", error);
    res.status(500).json({ error: error.message });
  }
});

// Redirect config endpoint to consolidated for backward compatibility
app.get("/api/matches/config", (req, res) => {
  res.redirect("/api/matches/consolidated");
});

// Get active months for individual matches
app.get("/api/matches/active-months", async (req, res) => {
  try {
    const { data, error } = await supabase.from("matches").select("played_at");

    if (error) throw error;

    // Extract unique year-month combinations
    const months = new Set();
    const formattedMonths = [];

    data.forEach((match) => {
      const date = new Date(match.played_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!months.has(key)) {
        months.add(key);

        // Get month name
        const monthName = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        formattedMonths.push({
          value: key,
          label: monthName,
          year,
          month,
        });
      }
    });

    // Sort by date (newest first)
    formattedMonths.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    // Add "All" option at the beginning
    return [{ value: "all", label: "All" }, ...formattedMonths];
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get matches by month
app.get("/api/matches/month/:year/:month", async (req, res) => {
  try {
    const { month, year } = req.params;

    // Parse month and year to integers
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ error: "Invalid month or year format" });
    }

    // Create date range for the specified month
    const startDate = new Date(yearInt, monthInt - 1, 1).toISOString();
    const endDate = new Date(yearInt, monthInt, 0).toISOString();

    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .gte("played_at", startDate)
      .lte("played_at", endDate)
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all matches
app.get("/api/matches", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get match by ID
app.get("/api/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Match not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a match
app.post("/api/matches", async (req, res) => {
  try {
    const { player1_id, player2_id, player1_score, player2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("matches")
      .insert([
        {
          player1_id,
          player2_id,
          player1_score,
          player2_score,
          played_at: played_at || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a match
app.put("/api/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { player1_id, player2_id, player1_score, player2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("matches")
      .update({
        player1_id,
        player2_id,
        player1_score,
        player2_score,
        played_at,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a match
app.delete("/api/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("matches").delete().eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// CORS test route
app.get("/api/cors-test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CORS is working properly",
    timestamp: new Date().toISOString(),
    headers: {
      origin: req.headers.origin,
      "user-agent": req.headers["user-agent"],
    },
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to calculate team stats
async function calculateTeamStats() {
  const { data: matches } = await supabase
    .from("team_matches")
    .select("*, team1:team1_id(*), team2:team2_id(*)");

  if (!matches || matches.length === 0) {
    return [];
  }

  const teamStatsMap = new Map();

  // Process each match
  matches.forEach((match) => {
    if (!match.team1 || !match.team2) return;

    const team1Id = match.team1_id;
    const team2Id = match.team2_id;
    const team1Won = match.team1_score > match.team2_score;
    const isDraw = match.team1_score === match.team2_score;

    // Initialize or update team1 stats
    const team1Stats = teamStatsMap.get(team1Id) || {
      id: team1Id,
      name: match.team1.name,
      emoji: match.team1.emoji,
      matches_played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
    };

    team1Stats.matches_played += 1;

    if (team1Won) {
      team1Stats.wins += 1;
      team1Stats.points += 3;
    } else if (isDraw) {
      team1Stats.draws += 1;
      team1Stats.points += 1;
    } else {
      team1Stats.losses += 1;
    }

    teamStatsMap.set(team1Id, team1Stats);

    // Initialize or update team2 stats
    const team2Stats = teamStatsMap.get(team2Id) || {
      id: team2Id,
      name: match.team2.name,
      emoji: match.team2.emoji,
      matches_played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
    };

    team2Stats.matches_played += 1;

    if (!team1Won && !isDraw) {
      team2Stats.wins += 1;
      team2Stats.points += 3;
    } else if (isDraw) {
      team2Stats.draws += 1;
      team2Stats.points += 1;
    } else {
      team2Stats.losses += 1;
    }

    teamStatsMap.set(team2Id, team2Stats);
  });

  // Convert map to array and sort by points (desc), then wins (desc)
  return Array.from(teamStatsMap.values()).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.wins - a.wins;
  });
}

// Helper function to calculate player stats
async function calculatePlayerStats() {
  const { data: matches } = await supabase
    .from("matches")
    .select("*, player1:player1_id(*), player2:player2_id(*)");

  if (!matches || matches.length === 0) {
    return [];
  }

  const playerStatsMap = new Map();

  // Process each match
  matches.forEach((match) => {
    if (!match.player1 || !match.player2) return;

    const player1Id = match.player1_id;
    const player2Id = match.player2_id;
    const player1Won = match.player1_score > match.player2_score;
    const isDraw = match.player1_score === match.player2_score;

    // Initialize or update player1 stats
    const player1Stats = playerStatsMap.get(player1Id) || {
      id: player1Id,
      name: match.player1.name,
      nickname: match.player1.nickname,
      emoji: match.player1.emoji,
      matches_played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
    };

    player1Stats.matches_played += 1;

    if (player1Won) {
      player1Stats.wins += 1;
      player1Stats.points += 3;
    } else if (isDraw) {
      player1Stats.draws += 1;
      player1Stats.points += 1;
    } else {
      player1Stats.losses += 1;
    }

    playerStatsMap.set(player1Id, player1Stats);

    // Initialize or update player2 stats
    const player2Stats = playerStatsMap.get(player2Id) || {
      id: player2Id,
      name: match.player2.name,
      nickname: match.player2.nickname,
      emoji: match.player2.emoji,
      matches_played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
    };

    player2Stats.matches_played += 1;

    if (!player1Won && !isDraw) {
      player2Stats.wins += 1;
      player2Stats.points += 3;
    } else if (isDraw) {
      player2Stats.draws += 1;
      player2Stats.points += 1;
    } else {
      player2Stats.losses += 1;
    }

    playerStatsMap.set(player2Id, player2Stats);
  });

  // Convert map to array and sort by points (desc), then wins (desc)
  return Array.from(playerStatsMap.values()).sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.wins - a.wins;
  });
}

// Helper function to get months with team matches
async function getActiveTeamMatchMonths() {
  const { data: matches } = await supabase
    .from("team_matches")
    .select("played_at");

  if (!matches || matches.length === 0) {
    return [{ value: "all", label: "All" }];
  }

  const monthsSet = new Set();

  // Create a set of unique year-month combinations
  matches.forEach((match) => {
    const date = new Date(match.played_at);
    const monthString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    monthsSet.add(JSON.stringify({ value: monthString, label: monthName }));
  });

  // Convert set back to array of objects
  const months = Array.from(monthsSet).map((month) => JSON.parse(month));

  // Sort months in descending order (newest first)
  months.sort((a, b) => b.value.localeCompare(a.value));

  // Add "All" option at the beginning
  return [{ value: "all", label: "All" }, ...months];
}

// Helper function to get months with individual matches
async function getActiveMatchMonths() {
  const { data: matches } = await supabase.from("matches").select("played_at");

  if (!matches || matches.length === 0) {
    return [{ value: "all", label: "All" }];
  }

  const monthsSet = new Set();

  // Create a set of unique year-month combinations
  matches.forEach((match) => {
    const date = new Date(match.played_at);
    const monthString = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    monthsSet.add(JSON.stringify({ value: monthString, label: monthName }));
  });

  // Convert set back to array of objects
  const months = Array.from(monthsSet).map((month) => JSON.parse(month));

  // Sort months in descending order (newest first)
  months.sort((a, b) => b.value.localeCompare(a.value));

  // Add "All" option at the beginning
  return [{ value: "all", label: "All" }, ...months];
}
