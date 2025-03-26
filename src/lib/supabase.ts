import { createClient } from "@supabase/supabase-js";

// Use environment variables with fallbacks for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if environment variables are missing
const isMissingEnvVars = !supabaseUrl || !supabaseAnonKey;

// Create the client regardless, but we'll warn about missing variables
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Show a warning in the console if environment variables are missing
if (isMissingEnvVars) {
  console.warn(
    "Warning: Supabase environment variables are missing. " +
      "The application may not function correctly. " +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}
