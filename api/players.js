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
    if (req.method === "GET") {
      let query = supabase.from("players").select("*").order("name");
      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json(data);
    } else if (req.method === "POST") {
      const { name, nickname, emoji } = req.body;

      const { data, error } = await supabase
        .from("players")
        .insert([{ name, nickname, emoji }])
        .select();

      if (error) throw error;
      return res.status(201).json(data[0]);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Players API error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
