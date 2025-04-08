// Player types
export interface Player {
  id: string;
  name: string;
  nickname: string | null;
  emoji: string;
  created_at?: string;
}

export interface PlayerStats {
  player_id: string;
  player_name: string;
  player_emoji: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_percentage: number;
  points: number;
}

// Team types
export interface Team {
  id: string;
  name: string;
  created_at?: string;
  players?: Player[];
}

export interface TeamPlayer {
  team_id: string;
  player_id: string;
}

export interface TeamStats {
  team_id: string;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_percentage: number;
}

// Match types
export interface Match {
  id: string;
  team_id: string;
  winner_id: string;
  loser_id: string;
  winner_score: number;
  loser_score: number;
  created_at: string;
  teams?: Team;
  winner?: Team;
  loser?: Team;
}

// Response types for API requests
export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

export interface MonthOption {
  value: string;
  label: string;
  year: number;
  month: number;
}
