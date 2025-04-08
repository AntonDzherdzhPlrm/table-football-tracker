import { Request, Response } from "express";
import supabase from "../db/supabase.js";

// Get all teams
export const getTeams = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("teams").select(`
        *,
        players:team_players(
          player_id,
          players:player_id(*)
        )
      `);

    if (error) throw error;

    // Transform the data to a more client-friendly format
    const transformedData = data.map((team) => {
      return {
        ...team,
        players: team.players.map((tp: any) => tp.players),
      };
    });

    return res.status(200).json(transformedData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get team by ID
export const getTeamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("teams")
      .select(
        `
        *,
        players:team_players(
          player_id,
          players:player_id(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Team not found" });

    // Transform the data
    const transformedData = {
      ...data,
      players: data.players.map((tp: any) => tp.players),
    };

    return res.status(200).json(transformedData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Create a new team
export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, player_ids } = req.body;

    if (
      !name ||
      !player_ids ||
      !Array.isArray(player_ids) ||
      player_ids.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Team name and at least one player ID are required" });
    }

    // Start a Supabase transaction
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert([{ name }])
      .select()
      .single();

    if (teamError) throw teamError;

    // Create team_players entries
    const teamPlayers = player_ids.map((player_id) => ({
      team_id: team.id,
      player_id,
    }));

    const { error: playerError } = await supabase
      .from("team_players")
      .insert(teamPlayers);

    if (playerError) {
      // If there's an error adding players, delete the team to avoid orphan data
      await supabase.from("teams").delete().eq("id", team.id);
      throw playerError;
    }

    // Fetch the complete team with players
    const { data: completeTeam, error: fetchError } = await supabase
      .from("teams")
      .select(
        `
        *,
        players:team_players(
          player_id,
          players:player_id(*)
        )
      `
      )
      .eq("id", team.id)
      .single();

    if (fetchError) throw fetchError;

    // Transform the data
    const transformedData = {
      ...completeTeam,
      players: completeTeam.players.map((tp: any) => tp.players),
    };

    return res.status(201).json(transformedData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a team
export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, player_ids } = req.body;

    if (
      !name ||
      !player_ids ||
      !Array.isArray(player_ids) ||
      player_ids.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Team name and at least one player ID are required" });
    }

    // Update team name
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (teamError) throw teamError;
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Delete existing team_players entries
    const { error: deleteError } = await supabase
      .from("team_players")
      .delete()
      .eq("team_id", id);

    if (deleteError) throw deleteError;

    // Create new team_players entries
    const teamPlayers = player_ids.map((player_id) => ({
      team_id: id,
      player_id,
    }));

    const { error: playerError } = await supabase
      .from("team_players")
      .insert(teamPlayers);

    if (playerError) throw playerError;

    // Fetch the complete team with updated players
    const { data: completeTeam, error: fetchError } = await supabase
      .from("teams")
      .select(
        `
        *,
        players:team_players(
          player_id,
          players:player_id(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Transform the data
    const transformedData = {
      ...completeTeam,
      players: completeTeam.players.map((tp: any) => tp.players),
    };

    return res.status(200).json(transformedData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a team
export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if the team exists
    const { data: team, error: fetchError } = await supabase
      .from("teams")
      .select("id")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!team) return res.status(404).json({ error: "Team not found" });

    // Delete team_players entries first
    const { error: deletePlayersError } = await supabase
      .from("team_players")
      .delete()
      .eq("team_id", id);

    if (deletePlayersError) throw deletePlayersError;

    // Delete the team
    const { error: deleteTeamError } = await supabase
      .from("teams")
      .delete()
      .eq("id", id);

    if (deleteTeamError) throw deleteTeamError;

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Get team stats
export const getTeamStats = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("team_stats")
      .select("*")
      .order("win_percentage", { ascending: false })
      .order("wins", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
