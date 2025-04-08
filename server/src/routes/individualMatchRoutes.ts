import express from "express";
import {
  getMatches,
  getMatchById,
  getMatchesByMonth,
  createMatch,
  updateMatch,
  deleteMatch,
  getActiveMonths,
} from "../controllers/individualMatchController.js";

const router = express.Router();

// Get all individual matches
router.get("/", getMatches);

// Get active months
router.get("/active-months", getActiveMonths);

// Get individual matches by month
router.get("/month/:year/:month", getMatchesByMonth);

// Get individual match by ID
router.get("/:id", getMatchById);

// Create a new individual match
router.post("/", createMatch);

// Update individual match
router.put("/:id", updateMatch);

// Delete individual match
router.delete("/:id", deleteMatch);

export default router;
