// Import Supabase client
import { createClient } from "@supabase/supabase-js";
import { verifySupabaseConfig, getEnvironmentInfo } from "./_vercel-checks.js";

// Initialize Supabase client with server-side credentials
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create Supabase client with service role key
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} catch (error) {
  console.error("Failed to create Supabase client:", error);
}

// Export the handler function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Debug logging
  console.log("API route /api/matches hit with method:", req.method);
  console.log("Environment info:", getEnvironmentInfo());

  // Verify Supabase config
  if (!verifySupabaseConfig()) {
    console.error("Supabase configuration is invalid");
    return res.status(500).json({
      error: "Server configuration error",
      details:
        "The Supabase connection is not properly configured on the server",
    });
  }

  if (!supabase) {
    console.error("Supabase client is not initialized");
    return res.status(500).json({
      error: "Server initialization error",
      details: "Failed to initialize Supabase client",
    });
  }

  // GET request - fetch matches with filter support
  if (req.method === "GET") {
    try {
      const { player1_id, player2_id } = req.query;

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

      if (player1_id && player1_id !== "all") {
        query = query.eq("player1_id", player1_id);
      }
      if (player2_id && player2_id !== "all") {
        query = query.eq("player2_id", player2_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch matches", details: error.message });
    }
  }

  // POST request - add a new match
  if (req.method === "POST") {
    try {
      const {
        player1_id,
        player2_id,
        player1_score,
        player2_score,
        played_at,
      } = req.body;

      if (!player1_id || !player2_id || !player1_score || !player2_score) {
        return res.status(400).json({ error: "All match fields are required" });
      }

      const matchData = {
        player1_id,
        player2_id,
        player1_score: parseInt(player1_score),
        player2_score: parseInt(player2_score),
        played_at: played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("matches")
        .insert([matchData]);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to add match", details: error.message });
    }
  }

  // PUT request - update a match
  if (req.method === "PUT") {
    try {
      const {
        id,
        player1_id,
        player2_id,
        player1_score,
        player2_score,
        played_at,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Match ID is required" });
      }

      const matchData = {
        player1_id,
        player2_id,
        player1_score: parseInt(player1_score),
        player2_score: parseInt(player2_score),
        played_at: played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("matches")
        .update(matchData)
        .eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to update match", details: error.message });
    }
  }

  // DELETE request - delete a match
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Match ID is required" });
      }

      const { error } = await supabase.from("matches").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete match", details: error.message });
    }
  }

  // If method not supported
  return res.status(405).json({ error: "Method not allowed" });
}
