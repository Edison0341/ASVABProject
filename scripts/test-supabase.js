// Simple script to test Supabase connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? 'Found' : 'Not found');
console.log('Anon Key:', supabaseAnonKey ? 'Found' : 'Not found');
console.log('Service Key:', supabaseServiceKey ? 'Found' : 'Not found');

// Try with anon key first
console.log('\nTesting with anon key...');
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testAnonConnection() {
  try {
    const { data, error } = await supabaseAnon.from('quizzes').select('count').limit(1);
    
    if (error) {
      console.error('Error with anon key:', error);
    } else {
      console.log('Anon key connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception with anon key:', err);
  }
}

// Then try with service role key
console.log('\nTesting with service role key...');
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

async function testServiceConnection() {
  try {
    const { data, error } = await supabaseService.from('quizzes').select('count').limit(1);
    
    if (error) {
      console.error('Error with service key:', error);
    } else {
      console.log('Service key connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Exception with service key:', err);
  }
}

// Run both tests
async function runTests() {
  await testAnonConnection();
  await testServiceConnection();
}

runTests(); 
