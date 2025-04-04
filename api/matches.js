import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Vercel serverless function
export default async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log("API route /api/matches called with method:", req.method);

  try {
    // GET matches with filtering
    if (req.method === "GET") {
      const { player1, player2 } = req.query;

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

      // Apply filters if provided
      if (player1 && player1 !== "all") {
        query = query.eq("player1_id", player1);
      }

      if (player2 && player2 !== "all") {
        query = query.eq("player2_id", player2);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST new match
    else if (req.method === "POST") {
      const {
        player1_id,
        player2_id,
        player1_score,
        player2_score,
        played_at,
      } = req.body;

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
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Matches API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
