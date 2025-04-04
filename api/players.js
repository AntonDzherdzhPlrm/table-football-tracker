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

  console.log("API route /api/players called with method:", req.method);

  try {
    if (req.method === "GET") {
      console.log("Fetching players from Supabase");
      let query = supabase.from("players").select("*").order("name");
      const { data, error } = await query;

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Successfully fetched players:", data?.length || 0);
      return res.status(200).json(data || []);
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
};
