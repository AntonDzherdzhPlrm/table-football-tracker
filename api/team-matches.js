import { supabase } from "./_lib/supabase.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // GET team matches with filtering
    if (req.method === "GET") {
      const { team1, team2 } = req.query;

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

      // Apply filters if provided
      if (team1 && team1 !== "all") {
        query = query.eq("team1_id", team1);
      }

      if (team2 && team2 !== "all") {
        query = query.eq("team2_id", team2);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST new team match
    else if (req.method === "POST") {
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
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Team matches API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
