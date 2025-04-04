export default (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle OPTIONS request (CORS preflight)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  console.log("API root endpoint called");

  res.status(200).json({
    message: "Football Tracker API is running",
    endpoints: {
      "/api/players": "Player data",
      "/api/player-stats": "Player statistics",
      "/api/matches": "Match data",
      "/api/teams": "Team data",
      "/api/team-stats": "Team statistics",
      "/api/team-players": "Team players data",
      "/api/team-matches": "Team matches data",
    },
  });
};
