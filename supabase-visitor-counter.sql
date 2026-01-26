-- Create site_stats table for visitor counter
CREATE TABLE IF NOT EXISTS site_stats (
  id INT PRIMARY KEY DEFAULT 1,
  visitor_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial row
INSERT INTO site_stats (id, visitor_count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

-- Create function to increment visitor count
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE site_stats
  SET visitor_count = visitor_count + 1,
      updated_at = NOW()
  WHERE id = 1;
END;
$$;

-- Enable RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON site_stats
  FOR SELECT USING (true);

CREATE POLICY "Enable update for all users" ON site_stats
  FOR UPDATE USING (true);

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO anon;
GRANT EXECUTE ON FUNCTION increment_visitor_count() TO authenticated;
