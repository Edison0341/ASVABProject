-- Insert ASVAB Categories
INSERT INTO categories (name, description)
VALUES 
    ('General Science', 'Tests knowledge of life science, earth and space science, and physical science'),
    ('Arithmetic Reasoning', 'Tests ability to solve basic arithmetic word problems'),
    ('Word Knowledge', 'Tests ability to understand the meaning of words through synonyms'),
    ('Paragraph Comprehension', 'Tests ability to obtain information from written passages'),
    ('Mathematics Knowledge', 'Tests knowledge of mathematical concepts and applications'),
    ('Electronics Information', 'Tests knowledge of electrical current, circuits, devices, and electronic systems'),
    ('Auto and Shop Information', 'Tests knowledge of automotive maintenance and repair, and wood and metal shop practices'),
    ('Mechanical Comprehension', 'Tests understanding of basic mechanical and physical principles'),
    ('Assembling Objects', 'Tests ability to determine how an object will look when its parts are put together');

-- Insert Sample Quizzes
INSERT INTO quizzes (category_id, title, description, difficulty_level, time_limit, passing_score)
SELECT 
    id,
    'ASVAB General Science Practice Test',
    'Practice test covering basic concepts in life science, earth science, and physical science',
    'beginner',
    30,
    70
FROM categories 
WHERE name = 'General Science';

INSERT INTO quizzes (category_id, title, description, difficulty_level, time_limit, passing_score)
SELECT 
    id,
    'ASVAB Word Knowledge Practice Test',
    'Practice test for understanding word meanings and synonyms',
    'beginner',
    25,
    70
FROM categories 
WHERE name = 'Word Knowledge';

INSERT INTO quizzes (category_id, title, description, difficulty_level, time_limit, passing_score)
SELECT 
    id,
    'ASVAB Mathematics Knowledge Practice Test',
    'Practice test covering basic mathematical concepts and applications',
    'beginner',
    30,
    70
FROM categories 
WHERE name = 'Mathematics Knowledge';

-- Insert Sample Questions for General Science
WITH gs_quiz AS (SELECT id FROM quizzes WHERE title = 'ASVAB General Science Practice Test' LIMIT 1)
INSERT INTO questions (quiz_id, question_text, explanation, points)
VALUES
    ((SELECT id FROM gs_quiz), 'What is the process by which plants convert light energy into chemical energy?', 'Photosynthesis is the process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.', 2),
    ((SELECT id FROM gs_quiz), 'Which of the following is NOT a state of matter?', 'Energy is not a state of matter. The three main states of matter are solid, liquid, and gas, with plasma being the fourth state.', 2),
    ((SELECT id FROM gs_quiz), 'What is the smallest unit of an element that maintains its chemical properties?', 'An atom is the smallest unit of matter that defines an element''s chemical properties.', 2),
    ((SELECT id FROM gs_quiz), 'What is the primary function of red blood cells?', 'Red blood cells carry oxygen throughout the body using hemoglobin.', 2),
    ((SELECT id FROM gs_quiz), 'Which planet is known as the Red Planet?', 'Mars is known as the Red Planet due to its reddish appearance caused by iron oxide on its surface.', 2),
    ((SELECT id FROM gs_quiz), 'What is the process of water changing from liquid to gas called?', 'Evaporation is the process of water changing from liquid to gas at temperatures below boiling point.', 2),
    ((SELECT id FROM gs_quiz), 'What type of energy is stored in chemical bonds?', 'Potential energy is stored in chemical bonds and can be released through chemical reactions.', 2),
    ((SELECT id FROM gs_quiz), 'Which of these is a compound?', 'Water (H2O) is a compound because it consists of two different elements chemically bonded together.', 2),
    ((SELECT id FROM gs_quiz), 'What is the speed of light in a vacuum?', 'The speed of light in a vacuum is approximately 3 × 10⁸ meters per second.', 2),
    ((SELECT id FROM gs_quiz), 'What is the main function of mitochondria in cells?', 'Mitochondria are the powerhouses of the cell, producing energy through cellular respiration.', 2);

-- Insert Options for General Science Questions
WITH q1 AS (SELECT id FROM questions WHERE question_text LIKE '%plants convert light%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q1), 'Photosynthesis', TRUE),
    ((SELECT id FROM q1), 'Respiration', FALSE),
    ((SELECT id FROM q1), 'Fermentation', FALSE),
    ((SELECT id FROM q1), 'Decomposition', FALSE);

WITH q2 AS (SELECT id FROM questions WHERE question_text LIKE '%state of matter%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q2), 'Solid', FALSE),
    ((SELECT id FROM q2), 'Energy', TRUE),
    ((SELECT id FROM q2), 'Liquid', FALSE),
    ((SELECT id FROM q2), 'Gas', FALSE);

WITH q3 AS (SELECT id FROM questions WHERE question_text LIKE '%smallest unit%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q3), 'Molecule', FALSE),
    ((SELECT id FROM q3), 'Cell', FALSE),
    ((SELECT id FROM q3), 'Atom', TRUE),
    ((SELECT id FROM q3), 'Electron', FALSE);

-- Insert Sample Questions for Word Knowledge
WITH wk_quiz AS (SELECT id FROM quizzes WHERE title = 'ASVAB Word Knowledge Practice Test' LIMIT 1)
INSERT INTO questions (quiz_id, question_text, explanation, points)
VALUES
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "ABUNDANT":', 'Abundant means plentiful or existing in large quantities.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "RELUCTANT":', 'Reluctant means unwilling or hesitant to do something.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "DILIGENT":', 'Diligent means having or showing care and conscientiousness in one''s work or duties.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "BENEVOLENT":', 'Benevolent means kind, generous, and caring about others.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "METICULOUS":', 'Meticulous means showing great attention to detail and accuracy.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "AMBIGUOUS":', 'Ambiguous means open to more than one interpretation; not having one obvious meaning.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "PRAGMATIC":', 'Pragmatic means dealing with things sensibly and realistically.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "TENACIOUS":', 'Tenacious means tending to keep a firm hold of something; persistent.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "EPHEMERAL":', 'Ephemeral means lasting for a very short time.', 2),
    ((SELECT id FROM wk_quiz), 'Choose the word that is most nearly the same in meaning as "VERBOSE":', 'Verbose means using or containing more words than needed.', 2);

-- Insert Options for Word Knowledge Questions
WITH q1 AS (SELECT id FROM questions WHERE question_text LIKE '%ABUNDANT%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q1), 'Scarce', FALSE),
    ((SELECT id FROM q1), 'Plentiful', TRUE),
    ((SELECT id FROM q1), 'Limited', FALSE),
    ((SELECT id FROM q1), 'Rare', FALSE);

WITH q2 AS (SELECT id FROM questions WHERE question_text LIKE '%RELUCTANT%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q2), 'Eager', FALSE),
    ((SELECT id FROM q2), 'Willing', FALSE),
    ((SELECT id FROM q2), 'Hesitant', TRUE),
    ((SELECT id FROM q2), 'Ready', FALSE);

WITH q3 AS (SELECT id FROM questions WHERE question_text LIKE '%DILIGENT%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q3), 'Lazy', FALSE),
    ((SELECT id FROM q3), 'Careless', FALSE),
    ((SELECT id FROM q3), 'Hardworking', TRUE),
    ((SELECT id FROM q3), 'Inattentive', FALSE);

-- Insert additional options for Word Knowledge questions
WITH q4 AS (SELECT id FROM questions WHERE question_text LIKE '%BENEVOLENT%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q4), 'Kind', TRUE),
    ((SELECT id FROM q4), 'Strict', FALSE),
    ((SELECT id FROM q4), 'Angry', FALSE),
    ((SELECT id FROM q4), 'Foolish', FALSE);

WITH q5 AS (SELECT id FROM questions WHERE question_text LIKE '%METICULOUS%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q5), 'Careless', FALSE),
    ((SELECT id FROM q5), 'Precise', TRUE),
    ((SELECT id FROM q5), 'Quick', FALSE),
    ((SELECT id FROM q5), 'Simple', FALSE);

WITH q6 AS (SELECT id FROM questions WHERE question_text LIKE '%AMBIGUOUS%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q6), 'Clear', FALSE),
    ((SELECT id FROM q6), 'Unclear', TRUE),
    ((SELECT id FROM q6), 'Certain', FALSE),
    ((SELECT id FROM q6), 'Direct', FALSE);

WITH q7 AS (SELECT id FROM questions WHERE question_text LIKE '%PRAGMATIC%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q7), 'Idealistic', FALSE),
    ((SELECT id FROM q7), 'Practical', TRUE),
    ((SELECT id FROM q7), 'Emotional', FALSE),
    ((SELECT id FROM q7), 'Theoretical', FALSE);

WITH q8 AS (SELECT id FROM questions WHERE question_text LIKE '%TENACIOUS%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q8), 'Weak', FALSE),
    ((SELECT id FROM q8), 'Persistent', TRUE),
    ((SELECT id FROM q8), 'Gentle', FALSE),
    ((SELECT id FROM q8), 'Timid', FALSE);

WITH q9 AS (SELECT id FROM questions WHERE question_text LIKE '%EPHEMERAL%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q9), 'Lasting', FALSE),
    ((SELECT id FROM q9), 'Temporary', TRUE),
    ((SELECT id FROM q9), 'Strong', FALSE),
    ((SELECT id FROM q9), 'Important', FALSE);

WITH q10 AS (SELECT id FROM questions WHERE question_text LIKE '%VERBOSE%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q10), 'Brief', FALSE),
    ((SELECT id FROM q10), 'Wordy', TRUE),
    ((SELECT id FROM q10), 'Clear', FALSE),
    ((SELECT id FROM q10), 'Simple', FALSE);

-- Insert additional options for General Science questions
WITH q4 AS (SELECT id FROM questions WHERE question_text LIKE '%red blood cells%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q4), 'Transport oxygen', TRUE),
    ((SELECT id FROM q4), 'Produce antibodies', FALSE),
    ((SELECT id FROM q4), 'Digest food', FALSE),
    ((SELECT id FROM q4), 'Filter blood', FALSE);

WITH q5 AS (SELECT id FROM questions WHERE question_text LIKE '%Red Planet%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q5), 'Venus', FALSE),
    ((SELECT id FROM q5), 'Mars', TRUE),
    ((SELECT id FROM q5), 'Jupiter', FALSE),
    ((SELECT id FROM q5), 'Mercury', FALSE);

WITH q6 AS (SELECT id FROM questions WHERE question_text LIKE '%water changing%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q6), 'Condensation', FALSE),
    ((SELECT id FROM q6), 'Evaporation', TRUE),
    ((SELECT id FROM q6), 'Sublimation', FALSE),
    ((SELECT id FROM q6), 'Precipitation', FALSE);

WITH q7 AS (SELECT id FROM questions WHERE question_text LIKE '%chemical bonds%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q7), 'Kinetic energy', FALSE),
    ((SELECT id FROM q7), 'Potential energy', TRUE),
    ((SELECT id FROM q7), 'Thermal energy', FALSE),
    ((SELECT id FROM q7), 'Nuclear energy', FALSE);

WITH q8 AS (SELECT id FROM questions WHERE question_text LIKE '%compound%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q8), 'Oxygen (O2)', FALSE),
    ((SELECT id FROM q8), 'Water (H2O)', TRUE),
    ((SELECT id FROM q8), 'Gold (Au)', FALSE),
    ((SELECT id FROM q8), 'Nitrogen (N2)', FALSE);

WITH q9 AS (SELECT id FROM questions WHERE question_text LIKE '%speed of light%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q9), '3 × 10⁶ m/s', FALSE),
    ((SELECT id FROM q9), '3 × 10⁸ m/s', TRUE),
    ((SELECT id FROM q9), '3 × 10⁷ m/s', FALSE),
    ((SELECT id FROM q9), '3 × 10⁹ m/s', FALSE);

WITH q10 AS (SELECT id FROM questions WHERE question_text LIKE '%mitochondria%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q10), 'Store genetic information', FALSE),
    ((SELECT id FROM q10), 'Produce energy', TRUE),
    ((SELECT id FROM q10), 'Synthesize proteins', FALSE),
    ((SELECT id FROM q10), 'Break down waste', FALSE);

-- Insert additional options for Word Knowledge questions
WITH q4 AS (SELECT id FROM questions WHERE question_text LIKE '%recipe calls%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q4), '5.5 cups', FALSE),
    ((SELECT id FROM q4), '6.25 cups', TRUE),
    ((SELECT id FROM q4), '7 cups', FALSE),
    ((SELECT id FROM q4), '7.5 cups', FALSE);

WITH q5 AS (SELECT id FROM questions WHERE question_text LIKE '%48 items%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q5), '6 packages', FALSE),
    ((SELECT id FROM q5), '8 packages', TRUE),
    ((SELECT id FROM q5), '9 packages', FALSE),
    ((SELECT id FROM q5), '10 packages', FALSE);

WITH q6 AS (SELECT id FROM questions WHERE question_text LIKE '%worker earns%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q6), '$675.00', FALSE),
    ((SELECT id FROM q6), '$712.50', TRUE),
    ((SELECT id FROM q6), '$725.00', FALSE),
    ((SELECT id FROM q6), '$750.00', FALSE);

WITH q7 AS (SELECT id FROM questions WHERE question_text LIKE '%15% of a number%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q7), '225', FALSE),
    ((SELECT id FROM q7), '300', TRUE),
    ((SELECT id FROM q7), '350', FALSE),
    ((SELECT id FROM q7), '450', FALSE);

WITH q8 AS (SELECT id FROM questions WHERE question_text LIKE '%tank can hold%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q8), '80 gallons', FALSE),
    ((SELECT id FROM q8), '90 gallons', TRUE),
    ((SELECT id FROM q8), '100 gallons', FALSE),
    ((SELECT id FROM q8), '110 gallons', FALSE);

WITH q9 AS (SELECT id FROM questions WHERE question_text LIKE '%6 workers%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q9), '2 hours', FALSE),
    ((SELECT id FROM q9), '3 hours', TRUE),
    ((SELECT id FROM q9), '4 hours', FALSE),
    ((SELECT id FROM q9), '5 hours', FALSE);

WITH q10 AS (SELECT id FROM questions WHERE question_text LIKE '%10% discount%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q10), '13.5%', FALSE),
    ((SELECT id FROM q10), '14.5%', TRUE),
    ((SELECT id FROM q10), '15%', FALSE),
    ((SELECT id FROM q10), '15.5%', FALSE);

-- Insert Mathematics Knowledge Questions
WITH mk_quiz AS (SELECT id FROM quizzes WHERE title = 'ASVAB Mathematics Knowledge Practice Test' LIMIT 1)
INSERT INTO questions (quiz_id, question_text, explanation, points)
VALUES
    ((SELECT id FROM mk_quiz), 'What is the square root of 144?', 'The square root of 144 is 12 because 12 × 12 = 144', 2),
    ((SELECT id FROM mk_quiz), 'Solve for x: 3x + 7 = 22', 'Subtract 7 from both sides: 3x = 15, then divide both sides by 3: x = 5', 2),
    ((SELECT id FROM mk_quiz), 'If 20% of a number is 40, what is the number?', '20% = 0.2, so if 0.2x = 40, then x = 40/0.2 = 200', 2),
    ((SELECT id FROM mk_quiz), 'What is the area of a rectangle with length 8 units and width 6 units?', 'Area of a rectangle = length × width = 8 × 6 = 48 square units', 2),
    ((SELECT id FROM mk_quiz), 'What is the value of 5² × 5³?', 'When multiplying powers with the same base, add the exponents: 5² × 5³ = 5⁵ = 3,125', 2),
    ((SELECT id FROM mk_quiz), 'If a triangle has angles measuring 45°, 45°, and 90°, what type of triangle is it?', 'A triangle with two 45° angles and one 90° angle is an isosceles right triangle', 2),
    ((SELECT id FROM mk_quiz), 'What is the slope of a line that passes through the points (2,3) and (4,7)?', 'Slope = (y₂-y₁)/(x₂-x₁) = (7-3)/(4-2) = 4/2 = 2', 2),
    ((SELECT id FROM mk_quiz), 'What is the value of 3! (3 factorial)?', '3! = 3 × 2 × 1 = 6', 2),
    ((SELECT id FROM mk_quiz), 'If a car travels 120 miles in 2 hours, what is its average speed in miles per hour?', 'Average speed = distance/time = 120/2 = 60 mph', 2),
    ((SELECT id FROM mk_quiz), 'What is the sum of the interior angles of a pentagon?', 'For a polygon with n sides, sum of interior angles = (n-2) × 180°. For a pentagon, n=5, so (5-2) × 180° = 540°', 2);

-- Insert Mathematics Knowledge Options
WITH q1 AS (SELECT id FROM questions WHERE question_text = 'What is the square root of 144?')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q1), '10', FALSE),
    ((SELECT id FROM q1), '12', TRUE),
    ((SELECT id FROM q1), '14', FALSE),
    ((SELECT id FROM q1), '16', FALSE);

WITH q2 AS (SELECT id FROM questions WHERE question_text = 'Solve for x: 3x + 7 = 22')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q2), '3', FALSE),
    ((SELECT id FROM q2), '4', FALSE),
    ((SELECT id FROM q2), '5', TRUE),
    ((SELECT id FROM q2), '6', FALSE);

WITH q3 AS (SELECT id FROM questions WHERE question_text = 'If 20% of a number is 40, what is the number?')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q3), '100', FALSE),
    ((SELECT id FROM q3), '150', FALSE),
    ((SELECT id FROM q3), '200', TRUE),
    ((SELECT id FROM q3), '250', FALSE);

WITH q4 AS (SELECT id FROM questions WHERE question_text = 'What is the area of a rectangle with length 8 units and width 6 units?')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q4), '28 square units', FALSE),
    ((SELECT id FROM q4), '48 square units', TRUE),
    ((SELECT id FROM q4), '56 square units', FALSE),
    ((SELECT id FROM q4), '64 square units', FALSE);

WITH q5 AS (SELECT id FROM questions WHERE question_text = 'What is the value of 5² × 5³?')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q5), '625', FALSE),
    ((SELECT id FROM q5), '1,250', FALSE),
    ((SELECT id FROM q5), '3,125', TRUE),
    ((SELECT id FROM q5), '15,625', FALSE);

WITH q6 AS (SELECT id FROM questions WHERE question_text LIKE '%45°, 45°, and 90°%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q6), 'Equilateral', FALSE),
    ((SELECT id FROM q6), 'Scalene', FALSE),
    ((SELECT id FROM q6), 'Isosceles Right', TRUE),
    ((SELECT id FROM q6), 'Obtuse', FALSE);

WITH q7 AS (SELECT id FROM questions WHERE question_text LIKE '%slope of a line%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q7), '1', FALSE),
    ((SELECT id FROM q7), '2', TRUE),
    ((SELECT id FROM q7), '3', FALSE),
    ((SELECT id FROM q7), '4', FALSE);

WITH q8 AS (SELECT id FROM questions WHERE question_text LIKE '%3! (3 factorial)%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q8), '3', FALSE),
    ((SELECT id FROM q8), '6', TRUE),
    ((SELECT id FROM q8), '9', FALSE),
    ((SELECT id FROM q8), '27', FALSE);

WITH q9 AS (SELECT id FROM questions WHERE question_text LIKE '%120 miles in 2 hours%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q9), '40 mph', FALSE),
    ((SELECT id FROM q9), '50 mph', FALSE),
    ((SELECT id FROM q9), '60 mph', TRUE),
    ((SELECT id FROM q9), '70 mph', FALSE);

WITH q10 AS (SELECT id FROM questions WHERE question_text LIKE '%interior angles of a pentagon%')
INSERT INTO options (question_id, option_text, is_correct)
VALUES
    ((SELECT id FROM q10), '360°', FALSE),
    ((SELECT id FROM q10), '450°', FALSE),
    ((SELECT id FROM q10), '540°', TRUE),
    ((SELECT id FROM q10), '720°', FALSE); 
