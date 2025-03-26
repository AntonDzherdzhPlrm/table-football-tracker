/*
  # Add Team Matches Support

  1. New Tables
    - `teams`
      - `id` (uuid, primary key)
      - `name` (text)
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
    - Add team statistics to player_stats view
    
  3. Security
    - Enable RLS on new tables
    - Add policies for all operations
*/

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create team_players table
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

-- Update player_stats view to include team matches
DROP MATERIALIZED VIEW IF EXISTS player_stats;

CREATE MATERIALIZED VIEW player_stats AS
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

  UNION ALL

  -- Team matches
  SELECT 
    tp.player_id,
    CASE 
      WHEN tm.team1_score > tm.team2_score THEN 1
      WHEN tm.team1_score = tm.team2_score THEN 0
      ELSE -1
    END as result
  FROM team_matches tm
  JOIN team_players tp ON tp.team_id = tm.team1_id

  UNION ALL

  SELECT 
    tp.player_id,
    CASE 
      WHEN tm.team2_score > tm.team1_score THEN 1
      WHEN tm.team1_score = tm.team2_score THEN 0
      ELSE -1
    END as result
  FROM team_matches tm
  JOIN team_players tp ON tp.team_id = tm.team2_id
)
SELECT 
  p.id,
  p.name,
  COUNT(*) as matches_played,
  COUNT(*) FILTER (WHERE am.result = 1) as wins,
  COUNT(*) FILTER (WHERE am.result = 0) as draws,
  COUNT(*) FILTER (WHERE am.result = -1) as losses,
  (COUNT(*) FILTER (WHERE am.result = 1) * 3 + 
   COUNT(*) FILTER (WHERE am.result = 0)) as points
FROM players p
LEFT JOIN all_matches am ON p.id = am.player_id
GROUP BY p.id, p.name
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Create index for better performance
CREATE UNIQUE INDEX player_stats_id_idx ON player_stats (id);

-- Update refresh function
CREATE OR REPLACE FUNCTION refresh_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW player_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for team_matches
CREATE TRIGGER refresh_player_stats_on_team_match_change
AFTER INSERT OR UPDATE OR DELETE ON team_matches
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_player_stats();