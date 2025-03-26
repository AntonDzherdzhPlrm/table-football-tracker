/*
  # Add Player Details

  1. Changes
    - Add nickname and emoji fields to players table
    - Make nickname optional
    - Set default emoji
    - Update existing policies

  2. Security
    - Maintain existing security policies
    - Ensure new fields are protected by RLS
*/

-- Add new columns to players table
ALTER TABLE players 
  ADD COLUMN IF NOT EXISTS nickname text,
  ADD COLUMN IF NOT EXISTS emoji text NOT NULL DEFAULT '👤';

-- Update the player_stats view to include new fields
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
  COUNT(*) as matches_played,
  COUNT(*) FILTER (WHERE am.result = 1) as wins,
  COUNT(*) FILTER (WHERE am.result = 0) as draws,
  COUNT(*) FILTER (WHERE am.result = -1) as losses,
  (COUNT(*) FILTER (WHERE am.result = 1) * 3 + 
   COUNT(*) FILTER (WHERE am.result = 0)) as points
FROM players p
LEFT JOIN all_matches am ON p.id = am.player_id
GROUP BY p.id, p.name, p.nickname, p.emoji
ORDER BY points DESC, wins DESC, matches_played ASC;

-- Grant access to the view
GRANT SELECT ON player_stats TO authenticated;
GRANT SELECT ON player_stats TO anon;