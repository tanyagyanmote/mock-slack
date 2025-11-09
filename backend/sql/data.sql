--
-- All SQL statements must be on a single line and end in a semicolon.
--

-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --

INSERT INTO users (id, info) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"email": "anna@books.com", "username": "Anna Admin", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.G1ohpR3oQbbBHK4KzX7dU219Pv/lzze"}');
INSERT INTO users (id, info) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', '{"email": "molly@books.com", "username": "Molly Member", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y"}');
INSERT INTO users (id, info) VALUES ('470104fd-ae76-4ec8-a695-40e81f002541', '{"email": "dummy@email.com", "username": "Dummy Member", "password": "$2b$10$Y00XOZD/f5gBSpDusPUgU.iJufk6Nxx6gAoHRG8t2eHyGgoP2bK4y"}');


INSERT INTO workspaces (id, owner_id, info) VALUES ('9970731b-e9de-45a5-b4cb-198231f4abcb', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceOne"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('27864707-300e-418e-bd96-118322a2ea7c', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceTwo"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('f369341c-1089-40bd-808f-c2f7736edce5', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"name": "WorkspaceThree"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"name": "CSE115"}');


INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '9970731b-e9de-45a5-b4cb-198231f4abcb');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', '27864707-300e-418e-bd96-118322a2ea7c');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('da953f7e-4d08-4d12-b05e-a0f4526f1848', 'f369341c-1089-40bd-808f-c2f7736edce5');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190');
-- Add Molly Member to WorkspaceTwo and WorkspaceThree
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', '27864707-300e-418e-bd96-118322a2ea7c');
INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ('8cf5d496-f232-48c7-93f2-92b12b587d94', 'f369341c-1089-40bd-808f-c2f7736edce5');

INSERT INTO channels (id,workspace_id, info) VALUES ('e3cdbc28-4a78-4672-9778-4fae87d8dec8', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "CSE186"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('8ed30f43-ed07-45c1-9ce4-6214c8e7a3a9', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "UCSC"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('ba3bd920-ac4e-42ad-a6df-12781184cfdd', 'f369341c-1089-40bd-808f-c2f7736edce5', '{"name": "testing"}');
INSERT INTO channels (id,workspace_id, info) VALUES ('d9750c45-f971-4dc8-83d0-0aa0dc3aa99b', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '{"name": "iceyspicey"}');

INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('5625a8d0-0d88-4c43-b0d3-94fba9bf5875', 'e3cdbc28-4a78-4672-9778-4fae87d8dec8', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "Hello CSE186", "timestamp": "2023-09-01T10:00:00Z", "from": "Anna"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('47aaec5c-c98a-4ac8-8e10-36d220531099', '8ed30f43-ed07-45c1-9ce4-6214c8e7a3a9', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"msg": "Go UCSC!", "timestamp": "2023-09-02T11:00:00Z", "from": "Molly"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('2efc93da-9d33-4d7e-90a3-16c5b36cce87', 'e3cdbc28-4a78-4672-9778-4fae87d8dec8', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "Welcome everyone to the project discussion!", "timestamp": "2023-09-01T11:00:00Z", "from": "Anna"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('468e8cc9-8f42-4877-beae-00e98b0cf105', 'e3cdbc28-4a78-4672-9778-4fae87d8dec8', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "Ive uploaded the latest design drafts to the drive.", "timestamp": "2023-09-01T13:00:00Z", "from": "Anna"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('8884b8d8-9480-4a60-a8dc-b10d9d3dc559', 'e3cdbc28-4a78-4672-9778-4fae87d8dec8', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "Please make sure to check the updated project requirements.", "timestamp": "2023-09-01T12:00:00Z", "from": "Anna"}');

-- New workspaces for Molly
INSERT INTO workspaces (id, owner_id, info) VALUES ('1e22460c-9795-4f0d-9067-2a6fb8f40273', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"name": "WorkspaceTwoForMolly"}');
INSERT INTO workspaces (id, owner_id, info) VALUES ('20d1b72e-1c5c-4139-a419-50c1846b8239', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"name": "WorkspaceThreeForMolly"}');

-- Additional channels for Anna's WorkspaceOne
INSERT INTO channels (id, workspace_id, info) VALUES ('4168d954-ae65-4f77-8b06-3652a5331275', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "ProjectManagement"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('30a91c07-93d9-4826-96e1-c2574dab1cf5', '9970731b-e9de-45a5-b4cb-198231f4abcb', '{"name": "TeamCommunication"}');

-- Channels for Anna's WorkspaceTwo
INSERT INTO channels (id, workspace_id, info) VALUES ('2af37c35-4f69-424f-8199-225b475ab52b', '27864707-300e-418e-bd96-118322a2ea7c', '{"name": "Research"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('5c81e21e-7082-4b4e-a5c3-6d38c4c34a88', '27864707-300e-418e-bd96-118322a2ea7c', '{"name": "Development"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('6e209f0a-dcf8-48ec-9153-17cf58f4b602', '27864707-300e-418e-bd96-118322a2ea7c', '{"name": "Design"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('7a0489d1-8f52-4a3c-92f3-df5d5b3d2566', '27864707-300e-418e-bd96-118322a2ea7c', '{"name": "Marketing"}');

-- Additional channels for Anna's WorkspaceThree
INSERT INTO channels (id, workspace_id, info) VALUES ('8c01cf3b-67e2-4a91-b1df-abad5e00fa91', 'f369341c-1089-40bd-808f-c2f7736edce5', '{"name": "Finance"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('9b4b33dc-29d5-4a4e-a6a1-c54f73f8b825', 'f369341c-1089-40bd-808f-c2f7736edce5', '{"name": "HR"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('a4655f5c-4d15-4eb6-a4d8-8f3d2a55e78e', 'f369341c-1089-40bd-808f-c2f7736edce5', '{"name": "Operations"}');

-- Additional channels for Molly's CSE115B
INSERT INTO channels (id, workspace_id, info) VALUES ('b0d2f1a4-d4b4-4efc-a6b2-9b1d7a51a067', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '{"name": "Collaboration"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('bb21dadb-06b9-42cf-a2b9-670d0de0a768', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '{"name": "Productivity"}');
INSERT INTO channels (id, workspace_id, info) VALUES ('c314aafb-319c-4d65-8a90-dc11d1d9b3fc', '559d9fbb-4f9f-49ed-b0c2-1ee500f65190', '{"name": "Events"}');

-- ADDING TO TESTING CHANNEL

INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('9eaa64f1-5c85-4238-a35d-533ae19d3a7e', 'ba3bd920-ac4e-42ad-a6df-12781184cfdd', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "This is the first test message from Anna.", "timestamp": "2024-03-14T10:00:00Z", "from": "Anna"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('a725a8d0-1d88-4c43-b2d3-94fba9be5876', 'ba3bd920-ac4e-42ad-a6df-12781184cfdd', '8cf5d496-f232-48c7-93f2-92b12b587d94', '{"msg": "Here is the second message from Molly.", "timestamp": "2024-03-14T10:05:00Z", "from": "Molly"}');
INSERT INTO msg (id, channel_id, owner_id, info) VALUES ('bb35a7d1-2e99-4f48-b3f3-94eca9bf5877', 'ba3bd920-ac4e-42ad-a6df-12781184cfdd', 'da953f7e-4d08-4d12-b05e-a0f4526f1848', '{"msg": "And this is another message from Anna.", "timestamp": "2024-03-14T10:10:00Z", "from": "Anna"}');