CREATE DATABASE IF NOT EXISTS roacher_bowl_squares;

USE roacher_bowl_squares;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  username STRING UNIQUE NOT NULL,
  password_hash STRING NOT NULL,
  userid STRING NOT NULL
);

CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug STRING UNIQUE NOT NULL,
  host_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  state STRING NOT NULL DEFAULT 'INIT' CHECK (state = 'INIT' OR state = 'Q1' OR state = 'Q2' OR state = 'Q3' OR state = 'Q4' OR state = 'FINAL'),
  claim_cost DECIMAL NOT NULL DEFAULT 1.0,
  board JSONB DEFAULT '{}',
  scores JSONB DEFAULT '[[0,0]]',
  winners JSON DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games (id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  row INT4 NOT NULL,
  col INT4 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
  UNIQUE(game_id, row, col)
);