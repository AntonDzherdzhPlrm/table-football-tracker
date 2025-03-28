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
  console.log("API route /api/teams hit with method:", req.method);
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set");
  console.log("Supabase key:", supabaseServiceKey ? "Set" : "Not set");

  // GET request - fetch teams
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("teams").select("*");

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch teams", details: error.message });
    }
  }

  // POST request - add a new team
  if (req.method === "POST") {
    try {
      const { name, emoji, player1_id, player2_id } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Team name is required" });
      }

      const teamData = {
        name: name.trim(),
        emoji: emoji || "👥",
        player1_id: player1_id || null,
        player2_id: player2_id || null,
      };

      const { data, error } = await supabase.from("teams").insert([teamData]);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to add team", details: error.message });
    }
  }

  // PUT request - update a team
  if (req.method === "PUT") {
    try {
      const { id, name, emoji, player1_id, player2_id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Team ID is required" });
      }

      const teamData = {};
      if (name) teamData.name = name.trim();
      if (emoji !== undefined) teamData.emoji = emoji;
      if (player1_id !== undefined) teamData.player1_id = player1_id || null;
      if (player2_id !== undefined) teamData.player2_id = player2_id || null;

      const { data, error } = await supabase
        .from("teams")
        .update(teamData)
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
        .json({ error: "Failed to update team", details: error.message });
    }
  }

  // DELETE request - delete a team
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Team ID is required" });
      }

      const { error } = await supabase.from("teams").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to delete team", details: error.message });
    }
  }

  // If method not supported
  return res.status(405).json({ error: "Method not allowed" });
}
