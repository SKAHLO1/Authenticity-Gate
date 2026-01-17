-- Initial migration for Authenticity Gate database schema
-- Generated: 2026-01-07

-- Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  originality_score INTEGER,
  plagiarism_risk INTEGER,
  deepfake_confidence INTEGER,
  sentiment TEXT,
  raw_result JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table (for future chat features)
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table (for future chat features)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_verifications_status ON verifications(status);
CREATE INDEX IF NOT EXISTS idx_verifications_created_at ON verifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Add comment for documentation
COMMENT ON TABLE verifications IS 'Content verification records processed by GenLayer/Gemini AI';
COMMENT ON COLUMN verifications.status IS 'Verification status: pending, processing, completed, failed';
COMMENT ON COLUMN verifications.originality_score IS 'Originality score 0-100 (100 = highly original)';
COMMENT ON COLUMN verifications.plagiarism_risk IS 'Plagiarism risk score 0-100 (100 = high risk)';
COMMENT ON COLUMN verifications.deepfake_confidence IS 'AI generation probability 0-100 (100 = likely fake)';
