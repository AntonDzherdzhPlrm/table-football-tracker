export default function handler(req, res) {
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
}
