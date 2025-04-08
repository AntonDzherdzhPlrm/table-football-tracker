import express from "express";
import cors from "cors";
import playerRoutes from "./routes/playerRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import teamMatchRoutes from "./routes/teamMatchRoutes.js";

// Load environment variables
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/team-matches", teamMatchRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      message: err.message,
      error: process.env.NODE_ENV === "production" ? "An error occurred" : err,
    });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
