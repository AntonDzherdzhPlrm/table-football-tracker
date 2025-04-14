// Run this with: node test.js
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

async function testConnection() {
  try {
    const { data, error } = await supabase.from("players").select("*").limit(1);
    if (error) throw error;
    // Test connection successful
    process.exit(0);
  } catch (error) {
    console.error("Error connecting to Supabase:", error.message);
    process.exit(1);
  }
}

testConnection();
