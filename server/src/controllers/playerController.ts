import { Request, Response } from "express";
import supabase from "../db/supabase.js";

// Get all players
export const getPlayers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("players").select("*");

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get player by ID
export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Player not found" });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new player
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { name, nickname, emoji } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("players")
      .insert([{ name, nickname: nickname || null, emoji: emoji || "👤" }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a player
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, nickname, emoji } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const { data, error } = await supabase
      .from("players")
      .update({ name, nickname: nickname || null, emoji: emoji || "👤" })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Player not found" });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a player
export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("players").delete().eq("id", id);

    if (error) throw error;

    return res.status(200).json({ message: "Player deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get player stats
export const getPlayerStats = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("player_stats")
      .select("*")
      .order("points", { ascending: false })
      .order("wins", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
