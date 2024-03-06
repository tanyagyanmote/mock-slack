--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --

INSERT INTO users (username,email,password, workspaces) VALUES ('Molly Member', 'molly@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y', '[{"name": "Workspace Three"}]');
INSERT INTO users (username,email,password, workspaces) VALUES ('Anna Admin', 'anna@books.com', '$2b$10$Y00XOZD/f5gBSpDusPUgU.G1ohpR3oQbbBHK4KzX7dU219Pv/lzze','[{"name": "Workspace One", "channels": ["Channel 1", "Channel 2"]},{"name": "Workspace Two", "channels": ["Channel A", "Channel B"]}]');

