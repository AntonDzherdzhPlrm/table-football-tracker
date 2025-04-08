import { Request, Response } from "express";
import supabase from "../db/supabase.js";

// Get all individual matches
export const getMatches = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .order("played_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get individual match by ID
export const getMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Match not found" });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get individual matches by month
export const getMatchesByMonth = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.params;

    // Parse month and year to integers
    const monthInt = parseInt(month);
    const yearInt = parseInt(year);

    if (isNaN(monthInt) || isNaN(yearInt)) {
      return res.status(400).json({ error: "Invalid month or year format" });
    }

    // Create date range for the specified month
    const startDate = new Date(yearInt, monthInt - 1, 1).toISOString();
    const endDate = new Date(yearInt, monthInt, 0).toISOString();

    const { data, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        player1:player1_id (*),
        player2:player2_id (*)
      `
      )
      .gte("played_at", startDate)
      .lte("played_at", endDate)
      .order("played_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new individual match
export const createMatch = async (req: Request, res: Response) => {
  try {
    const { player1_id, player2_id, player1_score, player2_score, played_at } =
      req.body;

    if (!player1_id || !player2_id) {
      return res
        .status(400)
        .json({ error: "Player 1 ID and Player 2 ID are required" });
    }

    const { data, error } = await supabase
      .from("matches")
      .insert([
        {
          player1_id,
          player2_id,
          player1_score: player1_score || 0,
          player2_score: player2_score || 0,
          played_at: played_at || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update an individual match
export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { player1_id, player2_id, player1_score, player2_score, played_at } =
      req.body;

    if (!player1_id || !player2_id) {
      return res
        .status(400)
        .json({ error: "Player 1 ID and Player 2 ID are required" });
    }

    const { data, error } = await supabase
      .from("matches")
      .update({
        player1_id,
        player2_id,
        player1_score: player1_score || 0,
        player2_score: player2_score || 0,
        played_at: played_at || new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Match not found" });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete an individual match
export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("matches").delete().eq("id", id);

    if (error) throw error;

    return res.status(200).json({ message: "Match deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get active months (months with individual matches)
export const getActiveMonths = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("matches").select("played_at");

    if (error) throw error;

    // Extract unique year-month combinations
    const months = new Set<string>();
    const formattedMonths: Array<{
      value: string;
      label: string;
      year: number;
      month: number;
    }> = [];

    data.forEach((match) => {
      const date = new Date(match.played_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const key = `${year}-${month}`;

      if (!months.has(key)) {
        months.add(key);

        // Get month name
        const monthName = new Date(year, month - 1, 1).toLocaleString(
          "default",
          { month: "long" }
        );
        formattedMonths.push({
          value: key,
          label: `${monthName} ${year}`,
          year,
          month,
        });
      }
    });

    // Sort by date (newest first)
    formattedMonths.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    return res.status(200).json(formattedMonths);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
