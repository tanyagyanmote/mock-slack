const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// exports.getUserIdByEmail = async (email) => {
//   const query = {
//     text: `SELECT id FROM users WHERE info ->> 'email' = $1`,
//     values: [email],
//   };
//   const result = await pool.query(query);
//   if (result.rows.length === 0) {
//     throw new Error('User not found');
//   }
//   return result.rows[0].id;
// };

exports.login = async (email) => {
  const query = {
    text: `SELECT info FROM users WHERE info ->> 'email' = $1`,
    values: [`${email}`],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    return null;
  }
  return rows[0].info;
};

exports.addWorkspaceToUser = async (email, workspaceData) => {
  // const selectQuery = {
  //   text: `SELECT id FROM users WHERE info ->> 'email' = $1`,
  //   values: [email],
  // };
  // const res = await pool.query(selectQuery);
  // // if (res.rows.length === null) {
  // //   return null;
  // // }
  // const userId = res.rows[0].id;
  // const insertQuery = {
  //   text: "INSERT INTO workspaces (owner_id, info) VALUES ($1, $2::jsonb) RETURNING id",
  //   values: [userId, JSON.stringify(workspaceData)],
  // };
  // const insertRes = await pool.query(insertQuery);
  // // if (insertRes.rows.length === 0) {
  // //   return null;
  // // }
  // return insertRes.rows[0].id;
  const selectQuery = {
    text: `SELECT id FROM users WHERE info ->> 'email' = $1`,
    values: [email],
  };
  const res = await pool.query(selectQuery);
  if (res.rows.length === 0) {
    throw new Error('User not found');
  }
  const userId = res.rows[0].id;
  const insertQuery = {
    text: "INSERT INTO workspaces (owner_id, info) VALUES ($1, $2::jsonb) RETURNING id",
    values: [userId, JSON.stringify(workspaceData)],
  };
  const insertRes = await pool.query(insertQuery);
  if (insertRes.rows.length === 0) {
    throw new Error('Failed to add workspace');
  }
  return insertRes.rows[0].id;
};

exports.getUserWorkspacesByEmail = async (email) => {
  const query = {
    text: "SELECT id FROM users WHERE info ->> 'email' = $1",
    values: [email],
  };
  const result = await pool.query(query);
  if (result.rows.length === 0) {
    return null;
  }
  const userInfo = result.rows[0].id;
  const workspaceQuery = {
    text: "SELECT id, info FROM workspaces WHERE owner_id = $1",
    values: [userInfo],
  };
  const workspaceRes = await pool.query(workspaceQuery);
  // if (workspaceRes.rows.length === 0) {
  //   return null;
  // }
  const workspaces = workspaceRes.rows.map(row => ({
    ...row.info
  }));
  return workspaces;
};

exports.getChannelsByWorkspace = async (email, workspaceName) => {
  const query = {
    text: `SELECT id FROM users WHERE info ->> 'email' = $1`,
    values: [email],
  };
  const result = await pool.query(query);
  if (result.rows.length === 0) {
    return null;
  }
  const workspaces = result.rows[0].id;
  const workspaceQuery = {
    text: "SELECT id FROM workspaces WHERE owner_id = $1 AND info ->> 'name' = $2",
    values: [workspaces, workspaceName],
  };
  const workspaceResult = await pool.query(workspaceQuery);
  if (workspaceResult.rows.length === 0) {
    throw new Error('Workspace not found');
  }
  const workspaceId = workspaceResult.rows[0].id;
  const channelQuery = {
    text: "SELECT info FROM channels WHERE workspace_id = $1",
    values: [workspaceId],
  };
  const channelResult = await pool.query(channelQuery);
  const channels = channelResult.rows.map(row => row.info.name);
  return channels;
};

exports.addChannelToWorkspace = async (email, workspaceName, channelName) => {
  const selectQuery = {
      text: `SELECT id FROM users WHERE info ->> 'email' = $1`,
      values: [email],
  };
  const result = await pool.query(selectQuery);
  if (result.rows.length === 0) {
      throw new Error('User not found');
  }
  const workspaceQuery = {
    text: `SELECT id FROM workspaces WHERE owner_id = $1 AND info ->> 'name' = $2`,
    values: [result.rows[0].id, workspaceName],
  };
  const workspaceResult = await pool.query(workspaceQuery);
  if (workspaceResult.rows.length === 0) {
    throw new Error('Workspace not found');
  }
  const insertChannelQuery = {
    text: `INSERT INTO channels (workspace_id, info) VALUES ($1, $2::jsonb)`,
    values: [workspaceResult.rows[0].id, JSON.stringify({name: channelName})],
  };
  await pool.query(insertChannelQuery);
};