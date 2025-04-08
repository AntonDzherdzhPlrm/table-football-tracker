import express from "express";
import {
  getTeamMatches,
  getTeamMatchById,
  getTeamMatchesByMonth,
  createTeamMatch,
  updateTeamMatch,
  deleteTeamMatch,
  getTeamMatchActiveMonths,
} from "../controllers/teamMatchController.js";

const router = express.Router();

// Get all team matches
router.get("/", getTeamMatches);

// Get active months
router.get("/active-months", getTeamMatchActiveMonths);

// Get team matches by month
router.get("/month/:year/:month", getTeamMatchesByMonth);

// Get team match by ID
router.get("/:id", getTeamMatchById);

// Create a new team match
router.post("/", createTeamMatch);

// Update team match
router.put("/:id", updateTeamMatch);

// Delete team match
router.delete("/:id", deleteTeamMatch);

export default router;
