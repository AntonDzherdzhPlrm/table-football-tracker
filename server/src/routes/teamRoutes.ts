import express from "express";
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamStats,
} from "../controllers/teamController.js";

const router = express.Router();

// Get all teams
router.get("/", getTeams);

// Get team stats
router.get("/stats", getTeamStats);

// Get team by ID
router.get("/:id", getTeamById);

// Create a new team
router.post("/", createTeam);

// Update team
router.put("/:id", updateTeam);

// Delete team
router.delete("/:id", deleteTeam);

export default router;
