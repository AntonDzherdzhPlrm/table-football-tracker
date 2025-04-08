// API client utility for making requests to the server
import {
  Player,
  PlayerStats,
  Team,
  TeamStats,
  Match,
  TeamMatch,
} from "./types";

// Configuration for API base URL
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://table-football-tracker-server-34vxg95zx.vercel.app";
const USE_RELATIVE_PATH = import.meta.env.VITE_USE_RELATIVE_PATH === "true";

// Generic fetch function with error handling
async function fetchWithError<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Use absolute URL with BASE_URL if not using relative path
  const url = USE_RELATIVE_PATH
    ? `/api${endpoint}`
    : `${BASE_URL}/api${endpoint}`;

  const response = await fetch(url, {
    ...options,
    credentials: "omit", // Don't send credentials for cross-origin requests
    mode: "cors", // Explicitly set CORS mode
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Error ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

// Player API
export const PlayerAPI = {
  getAll: () => fetchWithError<Player[]>("/players"),
  getById: (id: string) => fetchWithError<Player>(`/players/${id}`),
  create: (data: Omit<Player, "id" | "created_at">) =>
    fetchWithError<Player>("/players", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Player>) =>
    fetchWithError<Player>(`/players/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchWithError<{ success: boolean }>(`/players/${id}`, {
      method: "DELETE",
    }),
  getStats: () => fetchWithError<PlayerStats[]>("/players/stats"),
};

// Team API
export const TeamAPI = {
  getAll: () => fetchWithError<Team[]>("/teams"),
  getById: (id: string) => fetchWithError<Team>(`/teams/${id}`),
  create: (data: { name: string; emoji: string; players: string[] }) =>
    fetchWithError<Team>("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: { name?: string; emoji?: string; players?: string[] }
  ) =>
    fetchWithError<Team>(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchWithError<{ success: boolean }>(`/teams/${id}`, {
      method: "DELETE",
    }),
  getStats: () => fetchWithError<TeamStats[]>("/teams/stats"),
};

// Team Match API
export const TeamMatchAPI = {
  getAll: async () => {
    return fetchWithError<TeamMatch[]>("/team-matches");
  },
  getById: async (id: string) => {
    return fetchWithError<TeamMatch>(`/team-matches/${id}`);
  },
  getByMonth: async (year: number, month: number) => {
    return fetchWithError<TeamMatch[]>(`/team-matches/month/${year}/${month}`);
  },
  create: async (data: Partial<TeamMatch>) => {
    return fetchWithError<TeamMatch>(`/team-matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<TeamMatch>) => {
    return fetchWithError<TeamMatch>(`/team-matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return fetchWithError<{ success: boolean }>(`/team-matches/${id}`, {
      method: "DELETE",
    });
  },
  getConfig: async () => {
    return fetchWithError<{
      teamMatches: TeamMatch[];
      teams: Team[];
      teamStats: TeamStats[];
      players: Player[];
      activeMonths: Array<{ value: string; label: string }>;
    }>(`/team-matches/consolidated`);
  },
  getConsolidated: async () => {
    return fetchWithError<{
      teamMatches: TeamMatch[];
      teams: Team[];
      teamStats: TeamStats[];
      players: Player[];
      activeMonths: Array<{ value: string; label: string }>;
    }>(`/team-matches/consolidated`);
  },
};

// Match API
export const MatchAPI = {
  getAll: async () => {
    return fetchWithError<Match[]>(`/matches`);
  },
  getById: async (id: string) => {
    return fetchWithError<Match>(`/matches/${id}`);
  },
  getByMonth: async (year: number, month: number) => {
    return fetchWithError<Match[]>(`/matches/month/${year}/${month}`);
  },
  create: async (data: Partial<Match>) => {
    return fetchWithError<Match>(`/matches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  update: async (id: string, data: Partial<Match>) => {
    return fetchWithError<Match>(`/matches/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  },
  delete: async (id: string) => {
    return fetchWithError<{ success: boolean }>(`/matches/${id}`, {
      method: "DELETE",
    });
  },
  getActiveMonths: async () => {
    return fetchWithError<Array<{ value: string; label: string }>>(
      `/matches/active-months`
    );
  },
  getConfig: async () => {
    return fetchWithError<{
      matches: Match[];
      players: Player[];
      playerStats: PlayerStats[];
      activeMonths: Array<{ value: string; label: string }>;
    }>(`/matches/consolidated`);
  },
  getConsolidated: async () => {
    return fetchWithError<{
      matches: Match[];
      players: Player[];
      playerStats: PlayerStats[];
      activeMonths: Array<{ value: string; label: string }>;
    }>(`/matches/consolidated`);
  },
};

// Export all API endpoints
export const API = {
  players: PlayerAPI,
  teams: TeamAPI,
  matches: MatchAPI,
  teamMatches: TeamMatchAPI,
  individualMatches: MatchAPI,
};
