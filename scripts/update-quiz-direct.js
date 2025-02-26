// Script to update the quiz name and remove duplicates
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use the anon key instead of service role key since that's what's working
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Print environment variables (redacted for security)
console.log('Environment variables:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'Found' : 'Not found');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create Supabase client with the anon key
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateQuiz() {
  try {
    console.log('Starting quiz update...');

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

    // 2. Update the quiz name
    const { data: updateData, error: updateError } = await supabase
      .from('quizzes')
      .update({
        title: 'ASVAB General Knowledge',
        description: 'General knowledge practice test for the ASVAB exam'
      })
      .eq('id', quizId)
      .select();

    if (updateError) {
      throw updateError;
    }

    console.log('Quiz renamed successfully:', updateData[0].title);

    // 3. Get all questions for this quiz
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
        uniqueQuestions.push({
          id: question.id,
          text: text
        });
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
      console.log(`Keeping only 10 questions out of ${uniqueQuestions.length}`);
      
      // Get the IDs of questions to remove (after the first 10)
      const questionsToKeep = uniqueQuestions.slice(0, 10).map(q => q.id);
      
      // Delete all questions that are not in the keep list
      const { error: removeError } = await supabase
        .from('questions')
        .delete()
        .eq('quiz_id', quizId)
        .not('id', 'in', `(${questionsToKeep.join(',')})`);

      if (removeError) {
        throw removeError;
      }

      console.log(`Reduced to 10 questions`);
    }

    // 7. Print the final list of questions
    const { data: finalQuestions, error: finalError } = await supabase
      .from('questions')
      .select('id, question_text')
      .eq('quiz_id', quizId)
      .order('id');
      
    if (finalError) {
      throw finalError;
    }
    
    console.log('\nFinal list of questions:');
    finalQuestions.forEach((q, i) => {
      console.log(`${i+1}. ${q.question_text.substring(0, 60)}${q.question_text.length > 60 ? '...' : ''}`);
    });
    
    console.log('Quiz update completed successfully!');
  } catch (error) {
    console.error('Error updating quiz:', error);
  }
}

updateQuiz(); 
