// Simple test endpoint to verify API and environment configuration
import { getEnvironmentInfo } from "./_vercel-checks.js";

export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    // Get environment info without sensitive data
    const envInfo = getEnvironmentInfo();

    // Return basic system info
    return res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: envInfo.environment,
      node: envInfo.nodeVersion,
      vercelEnv: envInfo.vercelEnv,
      region: envInfo.region,
      supabaseConfigured: envInfo.hasSupabaseUrl && envInfo.hasSupabaseKey,
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
