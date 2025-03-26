import { createClient } from "@supabase/supabase-js";

// Use environment variables with fallbacks for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if environment variables are missing
const isMissingEnvVars = !supabaseUrl || !supabaseAnonKey;

// Create the Supabase client with request debugging in development
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "public",
  },
  // Global callback for debugging in development
  global: {
    fetch: (...args) => {
      // For debugging network requests
      const isDev = import.meta.env.DEV;
      if (isDev) {
        const [url] = args;
        console.debug("Supabase fetch:", url);
      }
      return fetch(...args);
    },
  },
});

// Show a warning in the console if environment variables are missing
if (isMissingEnvVars) {
  console.warn(
    "Warning: Supabase environment variables are missing. " +
      "The application may not function correctly. " +
      "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables."
  );
}
