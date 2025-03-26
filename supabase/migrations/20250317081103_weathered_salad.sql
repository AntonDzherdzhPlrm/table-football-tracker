/*
  # Fix Player Stats View Permissions

  1. Changes
    - Replace materialized view with a regular view
    - Grant appropriate permissions to access the view
    - Remove RLS-related commands since they're not supported
    - Ensure public access to stats

  2. Security
    - Grant SELECT permissions to all authenticated users
    - Keep stats calculation logic unchanged
*/

-- Drop existing views if they exist
DROP MATERIALIZED VIEW IF EXISTS player_stats;
DROP VIEW IF EXISTS player_stats;

-- Create regular view for player stats
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

-- Grant access to the view
GRANT SELECT ON player_stats TO authenticated;
GRANT SELECT ON player_stats TO anon;

-- Drop existing trigger and function since they're no longer needed
DROP TRIGGER IF EXISTS refresh_player_stats_on_match_change ON matches;
DROP FUNCTION IF EXISTS refresh_player_stats();