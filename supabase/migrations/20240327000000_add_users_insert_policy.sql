-- Add RLS policy for users to insert their own records
CREATE POLICY "Users can insert their own data" ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Add RLS policy for users to update their own records
CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id); 
