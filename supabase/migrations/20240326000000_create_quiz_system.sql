-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated schema for the quiz system
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    time_limit INTEGER, -- in minutes
    passing_score INTEGER CHECK (passing_score BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    explanation TEXT, -- Explanation for the correct answer
    points INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES options(id) ON DELETE SET NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    time_spent INTEGER, -- in seconds
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER CHECK (score BETWEEN 0 AND 100),
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, quiz_id, question_id)
);

-- Add RLS policies for user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_quiz_category ON quizzes(category_id);
CREATE INDEX idx_question_quiz ON questions(quiz_id);
CREATE INDEX idx_option_question ON options(question_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_quiz ON user_progress(quiz_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample ASVAB categories
INSERT INTO categories (name, description) VALUES
('Arithmetic Reasoning', 'Tests ability to solve basic arithmetic word problems'),
('Word Knowledge', 'Tests ability to understand the meaning of words through synonyms'),
('Paragraph Comprehension', 'Tests ability to obtain information from written passages'),
('Mathematics Knowledge', 'Tests knowledge of mathematical concepts, principles and procedures');

-- Insert sample ASVAB quiz
INSERT INTO quizzes (category_id, title, description, difficulty_level, time_limit, passing_score) 
SELECT 
    id,
    'ASVAB Arithmetic Reasoning Practice Test',
    'Practice test for the Arithmetic Reasoning section of the ASVAB',
    'beginner',
    30,
    70
FROM categories 
WHERE name = 'Arithmetic Reasoning'
LIMIT 1;

-- Insert sample questions
WITH quiz AS (SELECT id FROM quizzes LIMIT 1)
INSERT INTO questions (quiz_id, question_text, explanation, points)
VALUES
    ((SELECT id FROM quiz), 'If 3 pencils cost $0.75, how much would 9 pencils cost?', 'Multiply the cost of 3 pencils by 3 to get the cost of 9 pencils: $0.75 × 3 = $2.25', 2),
    ((SELECT id FROM quiz), 'A car travels 150 miles in 3 hours. What is its average speed in miles per hour?', 'Divide the total distance by the total time: 150 ÷ 3 = 50 mph', 2),
    ((SELECT id FROM quiz), 'If a shirt originally costs $25 and is on sale for 20% off, what is the sale price?', 'Calculate 20% of $25 ($5) and subtract from original price: $25 - $5 = $20', 2);

-- Insert options for the questions
WITH q1 AS (SELECT id FROM questions WHERE question_text LIKE '%pencils%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q1), '$1.75', FALSE),
    ((SELECT id FROM q1), '$2.25', TRUE),
    ((SELECT id FROM q1), '$2.50', FALSE),
    ((SELECT id FROM q1), '$3.00', FALSE);

WITH q2 AS (SELECT id FROM questions WHERE question_text LIKE '%car travels%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q2), '45 mph', FALSE),
    ((SELECT id FROM q2), '50 mph', TRUE),
    ((SELECT id FROM q2), '55 mph', FALSE),
    ((SELECT id FROM q2), '60 mph', FALSE);

WITH q3 AS (SELECT id FROM questions WHERE question_text LIKE '%shirt%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q3), '$15', FALSE),
    ((SELECT id FROM q3), '$18', FALSE),
    ((SELECT id FROM q3), '$20', TRUE),
    ((SELECT id FROM q3), '$22', FALSE); 
