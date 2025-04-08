// Player types
export interface Player {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  created_at?: string;
}

export interface PlayerStats {
  id: string;
  name: string;
  nickname?: string;
  emoji: string;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  player_id?: string;
  player_name?: string;
  player_emoji?: string;
  win_percentage?: number;
}

// Team types
export interface Team {
  id: string;
  name: string;
  emoji: string;
  created_at?: string;
  player1_id?: string;
  player2_id?: string;
  players?: Player[];
  team1?: Team;
  team2?: Team;
}

export interface TeamStats {
  team_id: string;
  team_name: string;
  matches_played: number;
  wins: number;
  losses: number;
  win_percentage: number;
}

// Match types for the team matches feature
export interface TeamMatch {
  id: string;
  team1_id: string;
  team2_id: string;
  team1_score: number;
  team2_score: number;
  played_at: string;
  created_at?: string;
  team1?: Team;
  team2?: Team;
}

// Match types for the individual matches feature
export interface Match {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_score: number;
  player2_score: number;
  played_at: string;
  player1?: Player;
  player2?: Player;
}

// Month selection type
export interface MonthOption {
  value: string;
  label: string;
  year?: number;
  month?: number;
}
