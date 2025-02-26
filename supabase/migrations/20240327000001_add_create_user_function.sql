-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION create_user_record(
  user_id UUID,
  user_email TEXT,
  user_name TEXT
) RETURNS void AS $$
BEGIN
  INSERT INTO users (id, email, username)
  VALUES (user_id, user_email, user_name)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    username = EXCLUDED.username,
    updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_record TO authenticated; 
