// Script to run the SQL update using the Supabase CLI
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path to the SQL file
const sqlFilePath = path.join(__dirname, 'update-quiz.sql');

// Check if the SQL file exists
if (!fs.existsSync(sqlFilePath)) {
  console.error(`SQL file not found: ${sqlFilePath}`);
  process.exit(1);
}

// Read the SQL file
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

console.log('Attempting to run SQL update using Supabase CLI...');
console.log('This requires the Supabase CLI to be installed and configured.');

// Command to run the SQL using Supabase CLI
const command = `supabase db execute --file ${sqlFilePath}`;

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error running SQL update:');
    console.error(error.message);
    console.error('\nIf you don\'t have the Supabase CLI installed or configured, you can:');
    console.error('1. Run "npm run generate-sql" to generate the SQL statements');
    console.error('2. Copy the SQL statements and run them in the Supabase SQL Editor');
    process.exit(1);
  }

  if (stderr) {
    console.error('Error output:');
    console.error(stderr);
  }

  console.log('SQL update executed successfully!');
  console.log(stdout);
}); 
