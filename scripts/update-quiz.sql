-- SQL statements to update the quiz
-- Generated on: June 1, 2024

-- 1. Update quiz name
UPDATE quizzes
SET title = 'ASVAB General Knowledge',
    description = 'General knowledge practice test for the ASVAB exam'
WHERE id = '20520f74-6ca1-4346-ba59-0db8004d2d55';

-- 2. Delete duplicate questions (3 questions)
DELETE FROM questions
WHERE id IN ('ef309e59-058e-42f9-b970-924d31a762d4', '3c610ad9-64c4-4118-bef4-6dc071eb12f4', 'f68c8793-13bc-4291-ba32-813fa53a5838');

-- 3. Keep only 10 questions (if needed)
-- First, identify the questions we want to keep
WITH questions_to_keep AS (
  SELECT id
  FROM questions
  WHERE quiz_id = '20520f74-6ca1-4346-ba59-0db8004d2d55'
  ORDER BY id
  LIMIT 10
)
-- Delete questions that are not in our top 10
DELETE FROM questions
WHERE quiz_id = '20520f74-6ca1-4346-ba59-0db8004d2d55'
AND id NOT IN (SELECT id FROM questions_to_keep); 
