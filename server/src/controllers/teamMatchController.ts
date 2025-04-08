import { Request, Response } from "express";
import supabase from "../db/supabase.js";

// Get all team matches
export const getTeamMatches = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get team match by ID
export const getTeamMatchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Team match not found" });
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get team matches by month
export const getTeamMatchesByMonth = async (req: Request, res: Response) => {
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
      .from("team_matches")
      .select(
        `
        *,
        team1:team1_id (*),
        team2:team2_id (*)
      `
      )
      .gte("played_at", startDate)
      .lte("played_at", endDate)
      .order("played_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create a team match
export const createTeamMatch = async (req: Request, res: Response) => {
  try {
    const { team1_id, team2_id, team1_score, team2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("team_matches")
      .insert([
        {
          team1_id,
          team2_id,
          team1_score,
          team2_score,
          played_at: played_at || new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a team match
export const updateTeamMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { team1_id, team2_id, team1_score, team2_score, played_at } =
      req.body;

    const { data, error } = await supabase
      .from("team_matches")
      .update({
        team1_id,
        team2_id,
        team1_score,
        team2_score,
        played_at,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a team match
export const deleteTeamMatch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("team_matches").delete().eq("id", id);
    if (error) throw error;
    res.status(200).json({ message: "Team match deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get active months
export const getTeamMatchActiveMonths = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("team_matches")
      .select("played_at");

    if (error) throw error;

    // Extract unique year-month combinations
    const months = new Set<string>();
    const formattedMonths: Array<{
      value: string;
      label: string;
      year: number;
      month: number;
    }> = [];

    data.forEach((match: { played_at: string }) => {
      const date = new Date(match.played_at);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed
      const key = `${year}-${month.toString().padStart(2, "0")}`;

      if (!months.has(key)) {
        months.add(key);

        // Get month name
        const monthName = date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
        formattedMonths.push({
          value: key,
          label: monthName,
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

    res.status(200).json(formattedMonths);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
