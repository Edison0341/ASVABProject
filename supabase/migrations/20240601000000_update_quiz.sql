-- Update the quiz name from 'ASVAB Arithmetic Reasoning Practice Test' to 'ASVAB General Knowledge'
UPDATE quizzes
SET title = 'ASVAB General Knowledge',
    description = 'General knowledge practice test for the ASVAB exam'
WHERE title = 'ASVAB Arithmetic Reasoning Practice Test';

-- First, identify and remove duplicate questions
-- We'll create a temporary table to track questions we want to keep
CREATE TEMP TABLE questions_to_keep AS
WITH ranked_questions AS (
  SELECT 
    id,
    quiz_id,
    question_text,
    ROW_NUMBER() OVER (PARTITION BY question_text ORDER BY id) AS row_num
  FROM questions
  WHERE quiz_id IN (SELECT id FROM quizzes WHERE title = 'ASVAB General Knowledge')
)
SELECT id FROM ranked_questions WHERE row_num = 1;

-- Delete questions that are duplicates (not in our questions_to_keep table)
DELETE FROM questions
WHERE quiz_id IN (SELECT id FROM quizzes WHERE title = 'ASVAB General Knowledge')
AND id NOT IN (SELECT id FROM questions_to_keep);

-- Now, let's keep only the 10 most relevant questions
-- First, we'll identify the questions we want to keep
CREATE TEMP TABLE top_questions AS
SELECT id
FROM questions
WHERE quiz_id IN (SELECT id FROM quizzes WHERE title = 'ASVAB General Knowledge')
ORDER BY id
LIMIT 10;

-- Delete questions that are not in our top 10
DELETE FROM questions
WHERE quiz_id IN (SELECT id FROM quizzes WHERE title = 'ASVAB General Knowledge')
AND id NOT IN (SELECT id FROM top_questions);

-- Drop our temporary tables
DROP TABLE questions_to_keep;
DROP TABLE top_questions; 
