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

  // Add debug info to help diagnose issues
  console.log("API route /api/players hit with method:", req.method);
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

  // GET request - fetch players
  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("players").select("*");

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch players", details: error.message });
    }
  }

  // POST request - add a new player
  if (req.method === "POST") {
    try {
      const { name, nickname, emoji } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Player name is required" });
      }

      const { data, error } = await supabase.from("players").insert([
        {
          name: name.trim(),
          nickname: nickname?.trim() || null,
          emoji: emoji || "👤",
        },
      ]);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to add player", details: error.message });
    }
  }

  // PUT request - update a player
  if (req.method === "PUT") {
    try {
      const { id, name, nickname, emoji } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Player ID is required" });
      }

      if (!name) {
        return res.status(400).json({ error: "Player name is required" });
      }

      const { data, error } = await supabase
        .from("players")
        .update({
          name: name.trim(),
          nickname: nickname?.trim() || null,
          emoji: emoji || "👤",
        })
        .eq("id", id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to update player", details: error.message });
    }
  }

  // DELETE request - delete a player
  if (req.method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Player ID is required" });
      }

      const { error } = await supabase.from("players").delete().eq("id", id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete player", details: error.message });
    }
  }

  // If method not supported
  return res.status(405).json({ error: "Method not allowed" });
}
