#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function checkSupabaseConnection() {
  console.log("Verifying Supabase connection...");

  // Check for environment variables
  if (!supabaseUrl) {
    console.error("❌ ERROR: SUPABASE_URL environment variable is not set");
    process.exit(1);
  }

  if (!supabaseKey) {
    console.error(
      "❌ ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not set"
    );
    process.exit(1);
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to make a simple query to verify connection
    console.log("Attempting to connect to Supabase...");
    const { data, error } = await supabase
      .from("players")
      .select("count", { count: "exact", head: true });

    if (error) {
      console.error("❌ Connection to Supabase failed:");
      console.error(error);
      process.exit(1);
    }

    console.log("✅ Successfully connected to Supabase!");
    console.log("Your configuration appears to be correct.");

    // Exit successfully
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:");
    console.error(error);
    process.exit(1);
  }
}

// Run the check
checkSupabaseConnection();
