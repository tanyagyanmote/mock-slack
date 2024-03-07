--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy table --
DROP TABLE IF EXISTS dummy;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS workspaces;
DROP TABLE IF EXISTS channels;
DROP TABLE IF EXISTS dms;
DROP TABLE IF EXISTS workspace_memberships;

CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
-- CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),username VARCHAR(255),email VARCHAR(255), password VARCHAR(255), workspaces JSONB);
-- CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), info JSONB);

CREATE TABLE users (id UUID ,info JSONB);

CREATE TABLE workspaces (id UUID , owner_id UUID,info JSONB);

CREATE TABLE channels ( id UUID ,workspace_id UUID,info JSONB);

CREATE TABLE dms (id UUID ,channel_id UUID,info JSONB);

CREATE TABLE workspace_memberships (user_id UUID,workspace_id UUID, PRIMARY KEY (user_id, workspace_id));