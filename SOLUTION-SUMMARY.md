# Solution Summary: Quiz Update

## Problem

The original script to update the quiz was failing with an "Invalid API key" error because the service role key was not working correctly.

## Solution

We've created multiple options to update the quiz:

1. **SQL Generator Script** (`npm run generate-sql`)
   - Uses the anon key to connect to Supabase
   - Finds the quiz and its questions
   - Identifies duplicate questions
   - Generates SQL statements that can be run in the Supabase SQL Editor

2. **SQL File** (`scripts/update-quiz.sql`)
   - Contains pre-generated SQL statements to:
     - Rename the quiz to "ASVAB General Knowledge"
     - Remove duplicate questions
     - Limit the quiz to 10 questions

3. **Supabase CLI Script** (`npm run run-sql-update`)
   - Attempts to run the SQL file using the Supabase CLI
   - Requires the Supabase CLI to be installed and configured

4. **Quiz Tools UI**
   - Uses the existing UI components to remove duplicate questions

## Files Created/Modified

1. `scripts/generate-update-sql.js` - Script to generate SQL statements
2. `scripts/update-quiz.sql` - SQL file with update statements
3. `scripts/run-sql-update.js` - Script to run SQL using Supabase CLI
4. `README-QUIZ-UPDATE.md` - Updated instructions
5. `package.json` - Added new scripts

## Dependencies Added

- `dotenv` - For loading environment variables

## Next Steps

1. Choose one of the options to update the quiz
2. Verify that the update was successful
3. If using the SQL Editor, make sure to run all statements in the correct order 
