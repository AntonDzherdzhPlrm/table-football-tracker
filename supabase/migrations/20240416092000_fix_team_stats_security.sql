/*
  # Fix Team Stats Security

  1. Changes
    - Recreate the team_stats view with SECURITY INVOKER explicitly stated
    - This ensures the view runs with the permissions of the user querying it
    - Maintains the same query logic and structure as the original view
    - Adds win_percentage field needed by the controller

  2. Security
    - Addresses the security warning about SECURITY DEFINER
    - Ensures proper Row Level Security (RLS) enforcement
*/

-- Drop and recreate the team_stats view with SECURITY INVOKER
DROP VIEW IF EXISTS team_stats;

CREATE VIEW team_stats 
WITH (security_invoker = true)
AS
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
   COUNT(tmr.team_id) FILTER (WHERE tmr.result = 0)) as points,
  CASE 
    WHEN COUNT(tmr.team_id) > 0 THEN 
      ROUND((COUNT(tmr.team_id) FILTER (WHERE tmr.result = 1)::numeric / COUNT(tmr.team_id)) * 100, 2)
    ELSE 0
  END as win_percentage
FROM teams t
LEFT JOIN team_matches_results tmr ON t.id = tmr.team_id
GROUP BY t.id, t.name, t.emoji
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Grant access to the view
GRANT SELECT ON team_stats TO authenticated;
GRANT SELECT ON team_stats TO anon; 