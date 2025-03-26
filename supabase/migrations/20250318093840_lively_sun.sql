/*
  # Add Team Matches Support

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
      - `emoji` (text)
      - `created_at` (timestamp)
    
    - `team_players`
      - `id` (uuid, primary key)
      - `team_id` (uuid, foreign key)
      - `player_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `team_matches`
      - `id` (uuid, primary key)
      - `team1_id` (uuid, foreign key)
      - `team2_id` (uuid, foreign key)
      - `team1_score` (integer)
      - `team2_score` (integer)
      - `played_at` (timestamp)
      - `created_at` (timestamp)

  2. Views
    - Add team statistics view
    
  3. Security
    - Enable RLS on new tables
    - Add policies for all operations
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '👥',
  created_at timestamptz DEFAULT now()
);

-- Create team_players table (2 players per team)
CREATE TABLE IF NOT EXISTS team_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) NOT NULL,
  player_id uuid REFERENCES players(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, player_id)
);

-- Create team_matches table
CREATE TABLE IF NOT EXISTS team_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team1_id uuid REFERENCES teams(id) NOT NULL,
  team2_id uuid REFERENCES teams(id) NOT NULL,
  team1_score integer NOT NULL,
  team2_score integer NOT NULL,
  played_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT different_teams CHECK (team1_id != team2_id),
  CONSTRAINT valid_team_scores CHECK (team1_score >= 0 AND team2_score >= 0)
);

-- Create team stats view
DROP VIEW IF EXISTS team_stats;
CREATE VIEW team_stats AS
WITH team_matches_results AS (
  -- Matches as team1
  SELECT 
    team1_id as team_id,
    CASE 
      WHEN team1_score > team2_score THEN 1
      WHEN team1_score = team2_score THEN 0
      ELSE -1
    END as result
  FROM team_matches
  
  UNION ALL
  
  -- Matches as team2
  SELECT 
    team2_id as team_id,
    CASE 
      WHEN team2_score > team1_score THEN 1
      WHEN team1_score = team2_score THEN 0
      ELSE -1
    END as result
  FROM team_matches
)
SELECT 
  t.id,
  t.name,
  t.emoji,
  COUNT(tmr.team_id) as matches_played,
  COUNT(tmr.team_id) FILTER (WHERE tmr.result = 1) as wins,
  COUNT(tmr.team_id) FILTER (WHERE tmr.result = 0) as draws,
  COUNT(tmr.team_id) FILTER (WHERE tmr.result = -1) as losses,
  (COUNT(tmr.team_id) FILTER (WHERE tmr.result = 1) * 3 + 
   COUNT(tmr.team_id) FILTER (WHERE tmr.result = 0)) as points
FROM teams t
LEFT JOIN team_matches_results tmr ON t.id = tmr.team_id
GROUP BY t.id, t.name, t.emoji
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Drop and recreate player_stats view
DROP VIEW IF EXISTS player_stats;
CREATE VIEW player_stats AS
WITH all_matches AS (
  -- Individual matches
  SELECT 
    player1_id as player_id,
    CASE 
      WHEN player1_score > player2_score THEN 1 
      WHEN player1_score = player2_score THEN 0
      ELSE -1
    END as result
  FROM matches
  
  UNION ALL
  
  SELECT 
    player2_id as player_id,
    CASE 
      WHEN player2_score > player1_score THEN 1
      WHEN player1_score = player2_score THEN 0
      ELSE -1
    END as result
  FROM matches
)
SELECT 
  p.id,
  p.name,
  p.nickname,
  p.emoji,
  COUNT(am.player_id) as matches_played,
  COUNT(am.player_id) FILTER (WHERE am.result = 1) as wins,
  COUNT(am.player_id) FILTER (WHERE am.result = 0) as draws,
  COUNT(am.player_id) FILTER (WHERE am.result = -1) as losses,
  (COUNT(am.player_id) FILTER (WHERE am.result = 1) * 3 + 
   COUNT(am.player_id) FILTER (WHERE am.result = 0)) as points
FROM players p
LEFT JOIN all_matches am ON p.id = am.player_id
GROUP BY p.id, p.name, p.nickname, p.emoji
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_matches ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Enable read access for all users"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON teams FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON teams FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON teams FOR DELETE
  USING (true);

-- Create policies for team_players
CREATE POLICY "Enable read access for all users"
  ON team_players FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON team_players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON team_players FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON team_players FOR DELETE
  USING (true);

-- Create policies for team_matches
CREATE POLICY "Enable read access for all users"
  ON team_matches FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON team_matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON team_matches FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON team_matches FOR DELETE
  USING (true);

-- Grant access to the view
GRANT SELECT ON team_stats TO authenticated;
GRANT SELECT ON team_stats TO anon;