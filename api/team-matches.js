// Import Supabase client
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with server-side credentials
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  console.log("API route /api/team-matches hit with method:", req.method);
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set");
  console.log("Supabase key:", supabaseServiceKey ? "Set" : "Not set");

  // GET request - fetch team matches with filter support
  if (req.method === "GET") {
    try {
      const { team1_id, team2_id } = req.query;

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

      if (team1_id && team1_id !== "all") {
        query = query.eq("team1_id", team1_id);
      }
      if (team2_id && team2_id !== "all") {
        query = query.eq("team2_id", team2_id);
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
        .json({
          error: "Failed to fetch team matches",
          details: error.message,
        });
    }
  }

  // POST request - add a new team match
  if (req.method === "POST") {
    try {
      const { team1_id, team2_id, team1_score, team2_score, played_at } =
        req.body;

      if (!team1_id || !team2_id || !team1_score || !team2_score) {
        return res
          .status(400)
          .json({ error: "All team match fields are required" });
      }

      const matchData = {
        team1_id,
        team2_id,
        team1_score: parseInt(team1_score),
        team2_score: parseInt(team2_score),
        played_at: played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("team_matches")
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
        .json({ error: "Failed to add team match", details: error.message });
    }
  }

  // PUT request - update a team match
  if (req.method === "PUT") {
    try {
      const { id, team1_id, team2_id, team1_score, team2_score, played_at } =
        req.body;

      if (!id) {
        return res.status(400).json({ error: "Team match ID is required" });
      }

      const matchData = {
        team1_id,
        team2_id,
        team1_score: parseInt(team1_score),
        team2_score: parseInt(team2_score),
        played_at: played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("team_matches")
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
        .json({ error: "Failed to update team match", details: error.message });
    }
  }

  // DELETE request - delete a team match
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Team match ID is required" });
      }

      const { error } = await supabase
        .from("team_matches")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete team match", details: error.message });
    }
  }

  // If method not supported
  return res.status(405).json({ error: "Method not allowed" });
}
