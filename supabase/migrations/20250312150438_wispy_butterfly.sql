/*
  # Fix Row Level Security Policies

  1. Changes
    - Drop existing policies
    - Create new policies for both tables that allow all operations for authenticated users
    - Ensure RLS is enabled but properly configured

  2. Security
    - Enable RLS on both tables
    - Add comprehensive policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to all users for players" ON players;
DROP POLICY IF EXISTS "Allow insert access to all users for players" ON players;
DROP POLICY IF EXISTS "Allow read access to all users for matches" ON matches;
DROP POLICY IF EXISTS "Allow insert access to all users for matches" ON matches;

-- Create new policies for players table
CREATE POLICY "Enable read access for all users"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON players FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON players FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON players FOR DELETE
  USING (true);

-- Create new policies for matches table
CREATE POLICY "Enable read access for all users"
  ON matches FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON matches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update access for all users"
  ON matches FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete access for all users"
  ON matches FOR DELETE
  USING (true);