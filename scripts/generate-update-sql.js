// Script to generate SQL statements for updating the quiz
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateUpdateSQL() {
  try {
    console.log('Generating SQL statements for quiz update...');

    // 1. Find the quiz ID
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('id, title')
      .eq('title', 'ASVAB Arithmetic Reasoning Practice Test')
      .single();

    if (quizError) {
      throw quizError;
    }

    if (!quizData) {
      throw new Error('Quiz not found');
    }

    const quizId = quizData.id;
    console.log(`Found quiz: ${quizData.title} (${quizId})`);

    // 2. Get all questions for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, question_text')
      .eq('quiz_id', quizId);

    if (questionsError) {
      throw questionsError;
    }

    console.log(`Found ${questions.length} questions`);

    // 3. Identify duplicate questions
    const questionMap = new Map();
    const duplicates = [];
    const uniqueQuestions = [];

    questions.forEach(question => {
      const text = question.question_text.trim();
      if (questionMap.has(text)) {
        duplicates.push(question.id);
      } else {
        questionMap.set(text, question.id);
        uniqueQuestions.push({
          id: question.id,
          text: text
        });
      }
    });

    console.log(`Found ${duplicates.length} duplicate questions`);

    // 4. Generate SQL statements
    console.log('\n--- SQL STATEMENTS TO RUN IN SUPABASE SQL EDITOR ---\n');
    
    // Update quiz name
    console.log(`-- 1. Update quiz name`);
    console.log(`UPDATE quizzes`);
    console.log(`SET title = 'ASVAB General Knowledge',`);
    console.log(`    description = 'General knowledge practice test for the ASVAB exam'`);
    console.log(`WHERE id = '${quizId}';`);
    console.log();
    
    // Delete duplicate questions
    if (duplicates.length > 0) {
      console.log(`-- 2. Delete duplicate questions (${duplicates.length} questions)`);
      console.log(`DELETE FROM questions`);
      console.log(`WHERE id IN (${duplicates.map(id => `'${id}'`).join(', ')});`);
      console.log();
    }
    
    // If we have more than 10 unique questions, keep only the first 10
    if (uniqueQuestions.length > 10) {
      const questionsToKeep = uniqueQuestions.slice(0, 10).map(q => q.id);
      const questionsToRemove = uniqueQuestions.slice(10).map(q => q.id);
      
      console.log(`-- 3. Keep only the first 10 questions (removing ${questionsToRemove.length} questions)`);
      console.log(`DELETE FROM questions`);
      console.log(`WHERE quiz_id = '${quizId}'`);
      console.log(`AND id NOT IN (${questionsToKeep.map(id => `'${id}'`).join(', ')});`);
      console.log();
    }
    
    console.log('--- END OF SQL STATEMENTS ---\n');
    
    console.log('Instructions:');
    console.log('1. Copy the SQL statements above');
    console.log('2. Go to the Supabase dashboard');
    console.log('3. Navigate to the SQL Editor');
    console.log('4. Paste the SQL statements');
    console.log('5. Run the SQL statements');
    
  } catch (error) {
    console.error('Error generating SQL:', error);
  }
}

generateUpdateSQL(); 
