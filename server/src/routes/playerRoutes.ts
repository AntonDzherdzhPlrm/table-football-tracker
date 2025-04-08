import express from "express";
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayerStats,
} from "../controllers/playerController.js";

const router = express.Router();

// Get all players
router.get("/", getPlayers);

// Get player stats
router.get("/stats", getPlayerStats);

// Get player by ID
router.get("/:id", getPlayerById);

// Create a new player
router.post("/", createPlayer);

// Update player
router.put("/:id", updatePlayer);

// Delete player
router.delete("/:id", deletePlayer);

export default router;
