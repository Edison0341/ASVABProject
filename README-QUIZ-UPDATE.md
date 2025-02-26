# Quiz Update Instructions

This document provides instructions on how to update the "ASVAB Arithmetic Reasoning Practice Test" to "ASVAB General Knowledge" and remove duplicate questions.

## What This Update Does

1. Renames the quiz from "ASVAB Arithmetic Reasoning Practice Test" to "ASVAB General Knowledge"
2. Updates the quiz description
3. Removes duplicate questions (questions with identical text)
4. Reduces the total number of questions to 10, keeping only the most relevant ones

## Option 1: Use the SQL Generator Script

The easiest way to get the SQL statements needed for the update:

```bash
# Run the SQL generator script
npm run generate-sql
```

This will:
1. Connect to your Supabase database using the anon key
2. Find the quiz and its questions
3. Generate SQL statements to update the quiz name and remove duplicate questions
4. Print the SQL statements to the console

You can then copy these SQL statements and run them in the Supabase SQL Editor.

## Option 2: Use the Provided SQL File

We've included a SQL file with the necessary statements:

1. Open the file `scripts/update-quiz.sql`
2. Copy the SQL statements
3. Go to the Supabase dashboard
4. Navigate to the SQL Editor
5. Paste the SQL statements
6. Run the SQL statements

## Option 3: Use the Supabase CLI (if installed)

If you have the Supabase CLI installed and configured, you can run:

```bash
# Run the SQL update using the Supabase CLI
npm run run-sql-update
```

This will execute the SQL statements in `scripts/update-quiz.sql` directly using the Supabase CLI.

## Option 4: Use the Quiz Tools UI

You can also use the Quiz Tools UI to remove duplicate questions:

1. Navigate to the quiz page
2. If duplicate questions are detected, you'll see an orange warning card
3. Click the "Open Quiz Tools" button
4. On the Quiz Tools page, use the "Remove Duplicates" tab
5. Click the "Check & Remove Duplicates" button

## Verifying the Update

After running the update, you should see:

1. The quiz name has changed to "ASVAB General Knowledge"
2. No duplicate questions remain
3. The quiz has a maximum of 10 questions

## Troubleshooting

### "Invalid API key" Error

If you encounter an "Invalid API key" error when running the scripts:

1. Make sure your `.env` file contains the correct Supabase URL and API keys
2. The scripts use the anon key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`) which has limited permissions
3. For direct database updates, you'll need to use the SQL Editor in the Supabase dashboard

### Missing Dependencies

If you get an error about missing dependencies:

```bash
# Install the required dependencies
npm install dotenv @supabase/supabase-js
```

For additional help, please contact the development team. 
