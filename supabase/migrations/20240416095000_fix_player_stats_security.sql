/*
  # Fix Player Stats Security

  1. Changes
    - Recreate the player_stats view with SECURITY INVOKER explicitly stated
    - This ensures the view runs with the permissions of the user querying it
    - Maintains the same query logic and structure as the original view
    - Adds win_percentage field for consistency with team_stats

  2. Security
    - Addresses the security warning about SECURITY DEFINER
    - Ensures proper Row Level Security (RLS) enforcement
*/

-- Drop and recreate the player_stats view with SECURITY INVOKER
DROP VIEW IF EXISTS player_stats;

CREATE VIEW player_stats 
WITH (security_invoker = true)
AS
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
   COUNT(am.player_id) FILTER (WHERE am.result = 0)) as points,
  CASE 
    WHEN COUNT(am.player_id) > 0 THEN 
      ROUND((COUNT(am.player_id) FILTER (WHERE am.result = 1)::numeric / COUNT(am.player_id)) * 100, 2)
    ELSE 0
  END as win_percentage
FROM players p
LEFT JOIN all_matches am ON p.id = am.player_id
GROUP BY p.id, p.name, p.nickname, p.emoji
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Grant access to the view
GRANT SELECT ON player_stats TO authenticated;
GRANT SELECT ON player_stats TO anon; 