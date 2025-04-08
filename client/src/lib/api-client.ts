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
  "https://table-football-tracker-server.vercel.app";

// Only use relative paths when on the real production domain
const USE_RELATIVE_PATH =
  window.location.hostname === "table-football-tracker.vercel.app";

// Generic fetch function with error handling
async function fetchWithError<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Construct URL based on environment
  let url;
  if (USE_RELATIVE_PATH) {
    // In production Vercel deployment, use relative path
    url = `/api${cleanEndpoint}`;
  } else if (window.location.hostname === "localhost") {
    // For localhost development
    url = `${BASE_URL}${cleanEndpoint}`;
  } else {
    // For other environments, include /api
    url = `${BASE_URL}/api${cleanEndpoint}`;
  }

  console.log(
    `Fetching from URL: ${url}, hostname: ${window.location.hostname}, using relative: ${USE_RELATIVE_PATH}`
  );

  // Add debugging information to request headers
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      mode: "cors",
      credentials: "omit",
      headers,
    });

    // Log detailed error information
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${response.status}): ${errorText}`);
      console.error(`Request URL: ${url}`);
      throw new Error(
        `Error ${response.status}: ${response.statusText || errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
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
