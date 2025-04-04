import { supabase } from "./_lib/supabase.js";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Query the player_stats view
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .order("points", { ascending: false });

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error) {
    console.error("Player stats API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
