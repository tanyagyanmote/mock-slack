--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --

INSERT INTO users (id, info) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"email": "anna@books.com", "username": "Anna Admin", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.G1ohpR3oQbbBHK4KzX7dU219Pv/lzze"}');
INSERT INTO users (id, info) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', '{"email": "molly@books.com", "username": "Molly Member", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y"}');

INSERT INTO workspaces (id, owner_id, info) VALUES ('9970731b-e9de-45a5-b4cb-198231f4abcb', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceOne"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('27864707-300e-418e-bd96-118322a2ea7c', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceTwo"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('f369341c-1089-40bd-808f-c2f7736edce5', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceThree"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"name": "WorkspaceOne"}');


INSERT INTO channels (id,workspace_id, info) VALUES ('e3cdbc28-4a78-4672-9778-4fae87d8dec8', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "CSE186"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('8ed30f43-ed07-45c1-9ce4-6214c8e7a3a9', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "UCSC"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('ba3bd920-ac4e-42ad-a6df-12781184cfdd', 'f369341c-1089-40bd-808f-c2f7736edce5', '{"name": "testing"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('d9750c45-f971-4dc8-83d0-0aa0dc3aa99b', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '{"name": "iceyspicey"}');


INSERT INTO dms (id, channel_id, info) VALUES ('5625a8d0-0d88-4c43-b0d3-94fba9bf5875', 'e3cdbc28-4a78-4672-9778-4fae87d8dec8', '{"msg": "Hello CSE186", "timestamp": "2023-09-01T10:00:00Z"}');
INSERT INTO dms (id, channel_id, info) VALUES ('47aaec5c-c98a-4ac8-8e10-36d220531099', '8ed30f43-ed07-45c1-9ce4-6214c8e7a3a9', '{"msg": "Go UCSC!", "timestamp": "2023-09-02T11:00:00Z"}');

INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '9970731b-e9de-45a5-b4cb-198231f4abcb');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '27864707-300e-418e-bd96-118322a2ea7c');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', 'f369341c-1089-40bd-808f-c2f7736edce5');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190');