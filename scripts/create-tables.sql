-- Create the teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  position VARCHAR(100) NOT NULL,
  medical_exam_date DATE NOT NULL,
  medical_expiry_date DATE NOT NULL,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_expiry_date ON players(medical_expiry_date);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;

-- Create policies for teams
CREATE POLICY "Users can view their own teams" ON teams
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own teams" ON teams
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own teams" ON teams
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own teams" ON teams
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for players
CREATE POLICY "Users can view players in their teams" ON players
  FOR SELECT USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert players in their teams" ON players
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update players in their teams" ON players
  FOR UPDATE USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete players in their teams" ON players
  FOR DELETE USING (
    team_id IN (
      SELECT id FROM teams WHERE user_id = auth.uid()
    )
  );
