// Script to apply the quiz update migration
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateQuiz() {
  try {
    console.log('Starting quiz update...');

    // 1. Update the quiz name
    const { data: updateData, error: updateError } = await supabase
      .from('quizzes')
      .update({
        title: 'ASVAB General Knowledge',
        description: 'General knowledge practice test for the ASVAB exam'
      })
      .eq('title', 'ASVAB Arithmetic Reasoning Practice Test')
      .select();

    if (updateError) {
      throw updateError;
    }

    console.log('Quiz renamed successfully:', updateData);

    // 2. Get all questions for the quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('title', 'ASVAB General Knowledge')
      .single();

    if (quizError) {
      throw quizError;
    }

    const quizId = quizData.id;
    console.log('Quiz ID:', quizId);

    // 3. Get all questions for the quiz
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, question_text')
      .eq('quiz_id', quizId);

    if (questionsError) {
      throw questionsError;
    }

    console.log(`Found ${questions.length} questions`);

    // 4. Identify duplicate questions
    const questionMap = new Map();
    const duplicates = [];
    const uniqueQuestions = [];

    questions.forEach(question => {
      const text = question.question_text.trim();
      if (questionMap.has(text)) {
        duplicates.push(question.id);
      } else {
        questionMap.set(text, question.id);
        uniqueQuestions.push(question.id);
      }
    });

    console.log(`Found ${duplicates.length} duplicate questions`);

    // 5. Delete duplicate questions
    if (duplicates.length > 0) {
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', duplicates);

      if (deleteError) {
        throw deleteError;
      }

      console.log(`Deleted ${duplicates.length} duplicate questions`);
    }

    // 6. If we have more than 10 unique questions, keep only the first 10
    if (uniqueQuestions.length > 10) {
      const questionsToRemove = uniqueQuestions.slice(10);
      
      const { error: removeError } = await supabase
        .from('questions')
        .delete()
        .in('id', questionsToRemove);

      if (removeError) {
        throw removeError;
      }

      console.log(`Reduced to 10 questions by removing ${questionsToRemove.length} additional questions`);
    }

    console.log('Quiz update completed successfully!');
  } catch (error) {
    console.error('Error updating quiz:', error);
  }
}

updateQuiz(); 
