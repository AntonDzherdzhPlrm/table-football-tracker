import express from "express";
import serverless from "serverless-http";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

// Create Express app
const app = express();
const router = express.Router(); // Use an Express Router

// Create Supabase client using server-side credentials
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Middleware for the router
router.use(express.json());
router.use(cors());

// API Routes (using the router, paths start from root)
// Players
router.get("/players", async (req, res) => {
  try {
    const { data, error } = await supabase.from("players").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Players fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/players", async (req, res) => {
  try {
    const { data, error } = await supabase.from("players").insert([
      {
        name: req.body.name.trim(),
        nickname: req.body.nickname?.trim() || null,
        emoji: req.body.emoji || "👤",
      },
    ]);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Add player error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/players/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("players")
      .update({
        name: req.body.name.trim(),
        nickname: req.body.nickname?.trim() || null,
        emoji: req.body.emoji || "👤",
      })
      .eq("id", req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Update player error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/players/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete player error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Player Stats
router.get("/player-stats", async (req, res) => {
  try {
    const { data, error } = await supabase.from("player_stats").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Player stats fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Matches
router.get("/matches", async (req, res) => {
  try {
    let query = supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id(id, name, nickname, emoji),
        player2:player2_id(id, name, nickname, emoji)
      `
      )
      .order("played_at", { ascending: false });

    if (req.query.player1 && req.query.player1 !== "all") {
      query = query.eq("player1_id", req.query.player1);
    }
    if (req.query.player2 && req.query.player2 !== "all") {
      query = query.eq("player2_id", req.query.player2);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Matches fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/matches", async (req, res) => {
  try {
    const matchData = {
      player1_id: req.body.player1_id,
      player2_id: req.body.player2_id,
      player1_score: parseInt(req.body.player1_score),
      player2_score: parseInt(req.body.player2_score),
      played_at: new Date(req.body.played_at).toISOString(),
    };

    const { data, error } = await supabase.from("matches").insert([matchData]);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Add match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/matches/:id", async (req, res) => {
  try {
    const matchData = {
      player1_id: req.body.player1_id,
      player2_id: req.body.player2_id,
      player1_score: parseInt(req.body.player1_score),
      player2_score: parseInt(req.body.player2_score),
      played_at: new Date(req.body.played_at).toISOString(),
    };

    const { data, error } = await supabase
      .from("matches")
      .update(matchData)
      .eq("id", req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Update match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/matches/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Teams
router.get("/teams", async (req, res) => {
  try {
    const { data, error } = await supabase.from("teams").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Teams fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/teams", async (req, res) => {
  try {
    const { data, error } = await supabase.from("teams").insert([
      {
        name: req.body.name.trim(),
        emoji: req.body.emoji || "👥",
      },
    ]);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Add team error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/teams/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .update({
        name: req.body.name.trim(),
        emoji: req.body.emoji || "👥",
      })
      .eq("id", req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Update team error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/teams/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("teams")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete team error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Team Players
router.get("/team-players", async (req, res) => {
  try {
    let query = supabase.from("team_players").select(`
      *,
      team:team_id(id, name, emoji),
      player:player_id(id, name, nickname, emoji)
    `);

    if (req.query.team_id) {
      query = query.eq("team_id", req.query.team_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Team players fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/team-players", async (req, res) => {
  try {
    const { data, error } = await supabase.from("team_players").insert([
      {
        team_id: req.body.team_id,
        player_id: req.body.player_id,
      },
    ]);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Add team player error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/team-players/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("team_players")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete team player error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Team Stats
router.get("/team-stats", async (req, res) => {
  try {
    const { data, error } = await supabase.from("team_stats").select("*");
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Team stats fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Team Matches
router.get("/team-matches", async (req, res) => {
  try {
    let query = supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id(id, name, emoji),
        team2:team2_id(id, name, emoji)
      `
      )
      .order("played_at", { ascending: false });

    if (req.query.team1 && req.query.team1 !== "all") {
      query = query.eq("team1_id", req.query.team1);
    }
    if (req.query.team2 && req.query.team2 !== "all") {
      query = query.eq("team2_id", req.query.team2);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Team matches fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post("/team-matches", async (req, res) => {
  try {
    const matchData = {
      team1_id: req.body.team1_id,
      team2_id: req.body.team2_id,
      team1_score: parseInt(req.body.team1_score),
      team2_score: parseInt(req.body.team2_score),
      played_at: new Date(req.body.played_at).toISOString(),
    };

    const { data, error } = await supabase
      .from("team_matches")
      .insert([matchData]);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Add team match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put("/team-matches/:id", async (req, res) => {
  try {
    const matchData = {
      team1_id: req.body.team1_id,
      team2_id: req.body.team2_id,
      team1_score: parseInt(req.body.team1_score),
      team2_score: parseInt(req.body.team2_score),
      played_at: new Date(req.body.played_at).toISOString(),
    };

    const { data, error } = await supabase
      .from("team_matches")
      .update(matchData)
      .eq("id", req.params.id);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Update team match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/team-matches/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("team_matches")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error("Delete team match error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Mount the router at the root path, as Netlify's redirect handles the /api prefix
app.use("/", router); // Corrected mounting point

// Export handler for serverless function
export const handler = serverless(app);
