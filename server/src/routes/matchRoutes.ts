import express from "express";
import {
  getMatches,
  getMatchById,
  getMatchesByMonth,
  createMatch,
  updateMatch,
  deleteMatch,
  getActiveMonths,
} from "../controllers/matchController.js";

const router = express.Router();

// Get all matches
router.get("/", getMatches);

// Get active months
router.get("/active-months", getActiveMonths);

// Get matches by month
router.get("/month/:year/:month", getMatchesByMonth);

// Get match by ID
router.get("/:id", getMatchById);

// Create a new match
router.post("/", createMatch);

// Update match
router.put("/:id", updateMatch);

// Delete match
router.delete("/:id", deleteMatch);

export default router;
