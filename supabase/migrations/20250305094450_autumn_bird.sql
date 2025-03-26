/*
  # Table Football Game Schema

  1. New Tables
    - `players`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    
    - `matches`
      - `id` (uuid, primary key)
      - `player1_id` (uuid, foreign key)
      - `player2_id` (uuid, foreign key)
      - `player1_score` (integer)
      - `player2_score` (integer)
      - `played_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert data
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id uuid REFERENCES players(id) NOT NULL,
  player2_id uuid REFERENCES players(id) NOT NULL,
  player1_score integer NOT NULL,
  player2_score integer NOT NULL,
  played_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT different_players CHECK (player1_id != player2_id),
  CONSTRAINT valid_scores CHECK (player1_score >= 0 AND player2_score >= 0)
);

-- Enable RLS
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users for players"
  ON players FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all users for players"
  ON players FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow read access to all users for matches"
  ON matches FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Allow insert access to all users for matches"
  ON matches FOR INSERT TO authenticated
  WITH CHECK (true);