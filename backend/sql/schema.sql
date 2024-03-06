--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),username VARCHAR(255),email VARCHAR(255), password VARCHAR(255), workspaces JSONB);
