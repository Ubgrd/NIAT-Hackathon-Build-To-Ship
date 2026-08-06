-- ============================================================
-- Supabase Schema for Dev Assist AI
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Users table: stores GitHub OAuth profiles
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  github_id   TEXT UNIQUE NOT NULL,
  login       TEXT,           -- GitHub username
  name        TEXT,
  avatar_url  TEXT,
  email       TEXT,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Chat History table: stores Ops Brain queries and AI responses
CREATE TABLE chat_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  query       TEXT NOT NULL,
  answer      TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Saved Architectures table: stores Architect Mode outputs
CREATE TABLE saved_architectures (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES users(id) ON DELETE CASCADE,
  title                  TEXT,
  prompt                 TEXT,
  mermaid                TEXT,
  cost_breakdown         JSONB,
  total_monthly_estimate TEXT,
  scaffolding            JSONB,
  created_at             TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries by user_id
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_saved_architectures_user_id ON saved_architectures(user_id);
