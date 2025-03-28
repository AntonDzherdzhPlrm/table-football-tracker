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
  console.log("API route /api/stats hit with method:", req.method);
  console.log("Supabase URL:", supabaseUrl ? "Set" : "Not set");
  console.log("Supabase key:", supabaseServiceKey ? "Set" : "Not set");

  // GET request - fetch stats based on type (player or team)
  if (req.method === "GET") {
    try {
      const { type } = req.query;

      if (!type || (type !== "player" && type !== "team")) {
        return res
          .status(400)
          .json({ error: "Valid type parameter is required (player or team)" });
      }

      let data, error;

      if (type === "player") {
        // Fetch player stats
        const response = await supabase.from("player_stats").select("*");
        data = response.data;
        error = response.error;
      } else {
        // Fetch team stats
        const response = await supabase.from("team_stats").select("*");
        data = response.data;
        error = response.error;
      }

      if (error) {
        console.error("Supabase error:", error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Unexpected error:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch stats", details: error.message });
    }
  }

  // If method not supported
  return res.status(405).json({ error: "Method not allowed" });
}
