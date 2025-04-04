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
    // GET team players with filtering
    if (req.method === "GET") {
      const { team_id } = req.query;

      let query = supabase.from("team_players").select(`
          *,
          team:team_id(id, name, emoji),
          player:player_id(id, name, nickname, emoji)
        `);

      // Apply filter if provided
      if (team_id) {
        query = query.eq("team_id", team_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }

    // POST new team player
    else if (req.method === "POST") {
      const { team_id, player_id } = req.body;

      const { data, error } = await supabase
        .from("team_players")
        .insert([{ team_id, player_id }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    }

    // DELETE team player
    else if (req.method === "DELETE") {
      const { id } = req.query;

      const { error } = await supabase
        .from("team_players")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return res
        .status(200)
        .json({ message: "Team player deleted successfully" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Team players API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
