/*
  # Add Player Statistics View

  1. New Views
    - `player_stats`
      - Calculates matches played, wins, draws, losses, and points for each player
      - Orders players by total points descending

  2. Changes
    - Creates a materialized view for better performance
    - Includes all required statistics
*/

CREATE MATERIALIZED VIEW player_stats AS
WITH player_matches AS (
  -- Matches as player1
  SELECT 
    player1_id as player_id,
    CASE 
      WHEN player1_score > player2_score THEN 1 
      WHEN player1_score = player2_score THEN 0
      ELSE -1
    END as result
  FROM matches
  
  UNION ALL
  
  -- Matches as player2
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
  COUNT(*) as matches_played,
  COUNT(*) FILTER (WHERE pm.result = 1) as wins,
  COUNT(*) FILTER (WHERE pm.result = 0) as draws,
  COUNT(*) FILTER (WHERE pm.result = -1) as losses,
  (COUNT(*) FILTER (WHERE pm.result = 1) * 3 + 
   COUNT(*) FILTER (WHERE pm.result = 0)) as points
FROM players p
LEFT JOIN player_matches pm ON p.id = pm.player_id
GROUP BY p.id, p.name
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Create index for better performance
CREATE UNIQUE INDEX player_stats_id_idx ON player_stats (id);

-- Function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW player_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers to refresh the view when matches are modified
CREATE TRIGGER refresh_player_stats_on_match_change
AFTER INSERT OR UPDATE OR DELETE ON matches
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_player_stats();