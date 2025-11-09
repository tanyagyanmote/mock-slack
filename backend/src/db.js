// const jwt = require('jsonwebtoken');
// let bcrypt = require('bcrypt');

const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.login = async (email) => {
  const query = {
    text: `SELECT id, info FROM users WHERE info ->> 'email' = $1`,
    values: [`${email}`],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    return null;
  }
  return rows[0];
};

exports.getUserWorkspacesByID = async (userID) => {
  const workspaceQuery = {
    // text: 'SELECT id, info FROM workspaces WHERE owner_id = $1',
    text: `SELECT w.id, w.owner_id, w.info FROM workspace_memberships uw
    LEFT OUTER JOIN workspaces w ON uw.workspace_id = w.id
    WHERE uw.user_id = $1`,
    values: [userID],
  };
  const {rows} = await pool.query(workspaceQuery);
  if (rows.length == 0) {
    return null;
  }
  return rows;
};

exports.addWorkspaceToUser = async (userID, workspaceData) => {
  const userCheckQuery = {
    text: 'SELECT id FROM users WHERE id = $1',
    values: [userID],
  };
  const userCheckRes = await pool.query(userCheckQuery);
  if (userCheckRes.rows.length === 0) {
    return null;
  }
  const insertQuery = {
    text:
    `INSERT INTO workspaces 
    (owner_id, info) VALUES ($1, $2::jsonb) RETURNING id, info`,
    values: [userID, JSON.stringify(workspaceData)],
  };
  const insertRes = await pool.query(insertQuery);
  // if (insertRes.rows.length === 0) {
  //   return null;
  // }
  const newWorkspaceID = insertRes.rows[0].id;
  const insertMembershipQuery = {
    text:
    'INSERT INTO workspace_memberships (user_id, workspace_id) VALUES ($1, $2)',
    values: [userID, newWorkspaceID],
  };
  await pool.query(insertMembershipQuery);
  return insertRes.rows[0];
};

exports.getChannelsByWorkspace = async (workspaceID) => {
  const workspaceQuery = {
    // text: 'SELECT id FROM workspaces WHERE owner_id = $1
    // AND info ->> \'name\' = $2',
    text: `Select * FROM channels WHERE workspace_id = $1`,
    values: [workspaceID],
  };
  const {rows} = await pool.query(workspaceQuery);
  // if (workspaceResult.rows.length === 0) {
  //   return null;
  // }
  // console.log(rows)
  return rows;
  // const workspaceId = workspaceResult.rows[0].id;
  // const channelQuery = {
  //   text: 'SELECT info FROM channels WHERE workspace_id = $1',
  //   values: [workspaceId],
  // };
  // const {rows} = await pool.query(channelQuery);
  // return rows;
};

exports.addChannelToWorkspace = async (workspaceID, channelName) => {
  // const workspaceQuery = {
  //   text: `SELECT
  //   id FROM workspaces WHERE owner_id = $1 AND info ->> 'name' = $2`,
  //   values: [userID, workspaceName],
  // };
  // const workspaceResult = await pool.query(workspaceQuery);
  // if (workspaceResult.rows.length === 0) {
  //   return null;
  // }
  const insertChannelQuery = {
    text:
    `INSERT INTO channels (workspace_id, info) VALUES ($1, $2) RETURNING *`,
    values: [workspaceID, JSON.stringify(channelName)],
  };
  const {rows} = await pool.query(insertChannelQuery);
  return rows;
};

exports.getMessagesByChannel = async (channelID) => {
  const query = {
    text: `SELECT * FROM msg WHERE channel_id = $1`,
    values: [channelID],
  };
  const {rows} = await pool.query(query);
  return rows;
};


exports.deleteChannelFromWorkspace = async (channelID) => {
  const deleteChannelQuery = {
    text: `DELETE FROM channels WHERE id = $1 RETURNING *`,
    values: [channelID],
  };
  const {rows} = await pool.query(deleteChannelQuery);
  // if (rows.length === 0) {
  //   return null;
  // }
  return rows;
};
