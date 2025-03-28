// Helper file to verify environment variables and debug Vercel deployment issues

// Function to verify Supabase configuration
export function verifySupabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    console.error("ERROR: SUPABASE_URL environment variable is not set");
    return false;
  }

  if (!supabaseKey) {
    console.error(
      "ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not set"
    );
    return false;
  }

  // Basic URL validation
  try {
    new URL(supabaseUrl);
  } catch (e) {
    console.error("ERROR: SUPABASE_URL is not a valid URL:", supabaseUrl);
    return false;
  }

  // Basic key format validation (should be a long string)
  if (supabaseKey.length < 20) {
    console.error(
      "WARNING: SUPABASE_SERVICE_ROLE_KEY looks suspiciously short"
    );
  }

  return true;
}

// Function to get detailed environment info for debugging
export function getEnvironmentInfo() {
  return {
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "unknown",
    region: process.env.VERCEL_REGION || "unknown",
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
