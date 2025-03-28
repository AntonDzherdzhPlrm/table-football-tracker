import axios from "axios";
import { supabase } from "@/lib/supabase"; // Import supabase client for direct access in dev mode

// Determine if we're in production
const isProduction = import.meta.env.PROD;

// In production, use API endpoints; in development, use Supabase directly
// This is a temporary solution until serverless functions are properly set up for local development

// Players API
export const playersApi = {
  getAll: async () => {
    if (isProduction) {
      const response = await axios.get(`${window.location.origin}/api/players`);
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("players").select("*");
      if (error) throw error;
      return data || [];
    }
  },
  create: async (player: {
    name: string;
    nickname?: string;
    emoji?: string;
  }) => {
    if (isProduction) {
      const response = await axios.post(
        `${window.location.origin}/api/players`,
        player
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("players").insert([
        {
          name: player.name.trim(),
          nickname: player.nickname?.trim() || null,
          emoji: player.emoji || "👤",
        },
      ]);
      if (error) throw error;
      return data || [];
    }
  },
  update: async (
    id: string,
    player: { name: string; nickname?: string; emoji?: string }
  ) => {
    if (isProduction) {
      const response = await axios.put(
        `${window.location.origin}/api/players`,
        { id, ...player }
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase
        .from("players")
        .update({
          name: player.name.trim(),
          nickname: player.nickname?.trim() || null,
          emoji: player.emoji || "👤",
        })
        .eq("id", id);
      if (error) throw error;
      return data || [];
    }
  },
  delete: async (id: string) => {
    if (isProduction) {
      const response = await axios.delete(
        `${window.location.origin}/api/players?id=${id}`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { error } = await supabase.from("players").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    }
  },
};

// Matches API
export const matchesApi = {
  getAll: async (params?: { player1_id?: string; player2_id?: string }) => {
    if (isProduction) {
      const queryParams = new URLSearchParams();
      if (params?.player1_id && params.player1_id !== "all") {
        queryParams.append("player1_id", params.player1_id);
      }
      if (params?.player2_id && params.player2_id !== "all") {
        queryParams.append("player2_id", params.player2_id);
      }

      const url = queryParams.toString()
        ? `${window.location.origin}/api/matches?${queryParams.toString()}`
        : `${window.location.origin}/api/matches`;
      const response = await axios.get(url);
      return response.data;
    } else {
      // In development, use Supabase directly
      let query = supabase
        .from("matches")
        .select(
          `
          *,
          player1:player1_id(id, name, nickname, emoji),
          player2:player2_id(id, name, nickname, emoji)
        `
        )
        .order("played_at", { ascending: false });

      if (params?.player1_id && params.player1_id !== "all") {
        query = query.eq("player1_id", params.player1_id);
      }
      if (params?.player2_id && params.player2_id !== "all") {
        query = query.eq("player2_id", params.player2_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  },
  create: async (match: {
    player1_id: string;
    player2_id: string;
    player1_score: number | string;
    player2_score: number | string;
    played_at?: string;
  }) => {
    if (isProduction) {
      const response = await axios.post(
        `${window.location.origin}/api/matches`,
        match
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const matchData = {
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        player1_score:
          typeof match.player1_score === "string"
            ? parseInt(match.player1_score)
            : match.player1_score,
        player2_score:
          typeof match.player2_score === "string"
            ? parseInt(match.player2_score)
            : match.player2_score,
        played_at: match.played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("matches")
        .insert([matchData]);
      if (error) throw error;
      return data || [];
    }
  },
  update: async (
    id: string,
    match: {
      player1_id: string;
      player2_id: string;
      player1_score: number | string;
      player2_score: number | string;
      played_at?: string;
    }
  ) => {
    if (isProduction) {
      const response = await axios.put(
        `${window.location.origin}/api/matches`,
        { id, ...match }
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const matchData = {
        player1_id: match.player1_id,
        player2_id: match.player2_id,
        player1_score:
          typeof match.player1_score === "string"
            ? parseInt(match.player1_score)
            : match.player1_score,
        player2_score:
          typeof match.player2_score === "string"
            ? parseInt(match.player2_score)
            : match.player2_score,
        played_at: match.played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("matches")
        .update(matchData)
        .eq("id", id);
      if (error) throw error;
      return data || [];
    }
  },
  delete: async (id: string) => {
    if (isProduction) {
      const response = await axios.delete(
        `${window.location.origin}/api/matches?id=${id}`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { error } = await supabase.from("matches").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    }
  },
};

// Teams API
export const teamsApi = {
  getAll: async () => {
    if (isProduction) {
      const response = await axios.get(`${window.location.origin}/api/teams`);
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("teams").select("*");
      if (error) throw error;
      return data || [];
    }
  },
  create: async (team: {
    name: string;
    emoji?: string;
    player1_id?: string;
    player2_id?: string;
  }) => {
    if (isProduction) {
      const response = await axios.post(
        `${window.location.origin}/api/teams`,
        team
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("teams").insert([
        {
          name: team.name.trim(),
          emoji: team.emoji || "👥",
          player1_id: team.player1_id || null,
          player2_id: team.player2_id || null,
        },
      ]);
      if (error) throw error;
      return data || [];
    }
  },
  update: async (
    id: string,
    team: {
      name?: string;
      emoji?: string;
      player1_id?: string;
      player2_id?: string;
    }
  ) => {
    if (isProduction) {
      const response = await axios.put(`${window.location.origin}/api/teams`, {
        id,
        ...team,
      });
      return response.data;
    } else {
      // In development, use Supabase directly
      const teamData: any = {};
      if (team.name) teamData.name = team.name.trim();
      if (team.emoji) teamData.emoji = team.emoji;
      if (team.player1_id !== undefined)
        teamData.player1_id = team.player1_id || null;
      if (team.player2_id !== undefined)
        teamData.player2_id = team.player2_id || null;

      const { data, error } = await supabase
        .from("teams")
        .update(teamData)
        .eq("id", id);
      if (error) throw error;
      return data || [];
    }
  },
  delete: async (id: string) => {
    if (isProduction) {
      const response = await axios.delete(
        `${window.location.origin}/api/teams?id=${id}`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { error } = await supabase.from("teams").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    }
  },
};

// Team Matches API
export const teamMatchesApi = {
  getAll: async (params?: { team1_id?: string; team2_id?: string }) => {
    if (isProduction) {
      const queryParams = new URLSearchParams();
      if (params?.team1_id && params.team1_id !== "all") {
        queryParams.append("team1_id", params.team1_id);
      }
      if (params?.team2_id && params.team2_id !== "all") {
        queryParams.append("team2_id", params.team2_id);
      }

      const url = queryParams.toString()
        ? `${window.location.origin}/api/team-matches?${queryParams.toString()}`
        : `${window.location.origin}/api/team-matches`;
      const response = await axios.get(url);
      return response.data;
    } else {
      // In development, use Supabase directly
      let query = supabase
        .from("team_matches")
        .select(
          `
          *,
          team1:team1_id(id, name, emoji),
          team2:team2_id(id, name, emoji)
        `
        )
        .order("played_at", { ascending: false });

      if (params?.team1_id && params.team1_id !== "all") {
        query = query.eq("team1_id", params.team1_id);
      }
      if (params?.team2_id && params.team2_id !== "all") {
        query = query.eq("team2_id", params.team2_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  },
  create: async (match: {
    team1_id: string;
    team2_id: string;
    team1_score: number | string;
    team2_score: number | string;
    played_at?: string;
  }) => {
    if (isProduction) {
      const response = await axios.post(
        `${window.location.origin}/api/team-matches`,
        match
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const matchData = {
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        team1_score:
          typeof match.team1_score === "string"
            ? parseInt(match.team1_score)
            : match.team1_score,
        team2_score:
          typeof match.team2_score === "string"
            ? parseInt(match.team2_score)
            : match.team2_score,
        played_at: match.played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("team_matches")
        .insert([matchData]);
      if (error) throw error;
      return data || [];
    }
  },
  update: async (
    id: string,
    match: {
      team1_id: string;
      team2_id: string;
      team1_score: number | string;
      team2_score: number | string;
      played_at?: string;
    }
  ) => {
    if (isProduction) {
      const response = await axios.put(
        `${window.location.origin}/api/team-matches`,
        { id, ...match }
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const matchData = {
        team1_id: match.team1_id,
        team2_id: match.team2_id,
        team1_score:
          typeof match.team1_score === "string"
            ? parseInt(match.team1_score)
            : match.team1_score,
        team2_score:
          typeof match.team2_score === "string"
            ? parseInt(match.team2_score)
            : match.team2_score,
        played_at: match.played_at || new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("team_matches")
        .update(matchData)
        .eq("id", id);
      if (error) throw error;
      return data || [];
    }
  },
  delete: async (id: string) => {
    if (isProduction) {
      const response = await axios.delete(
        `${window.location.origin}/api/team-matches?id=${id}`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { error } = await supabase
        .from("team_matches")
        .delete()
        .eq("id", id);
      if (error) throw error;
      return { success: true };
    }
  },
};

// Stats API
export const statsApi = {
  getPlayerStats: async () => {
    if (isProduction) {
      const response = await axios.get(
        `${window.location.origin}/api/stats?type=player`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("player_stats").select("*");
      if (error) throw error;
      return data || [];
    }
  },
  getTeamStats: async () => {
    if (isProduction) {
      const response = await axios.get(
        `${window.location.origin}/api/stats?type=team`
      );
      return response.data;
    } else {
      // In development, use Supabase directly
      const { data, error } = await supabase.from("team_stats").select("*");
      if (error) throw error;
      return data || [];
    }
  },
};
