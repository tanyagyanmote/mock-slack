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


exports.login = async (email, password) => {
  let test = 'SELECT * FROM users WHERE email = $1';
  const query = {
    text: test,
    values: [`${email}`],
  };
  const {rows} = await pool.query(query);
  return rows[0];
};

exports.addWorkspaceToUser = async (email, workspaceData) => {
  const selectQuery = {
    text: 'SELECT workspaces FROM users WHERE email = $1',
    values: [email],
  };
  const res = await pool.query(selectQuery);
  if (res.rows.length === 0) {
    throw new Error('User not found');
  }
  let currentWorkspaces = res.rows[0].workspaces || [];
  currentWorkspaces.push(workspaceData);
  await pool.query('UPDATE users SET workspaces = $1 WHERE email = $2', [JSON.stringify(currentWorkspaces), email]);  
};

exports.getUserWorkspacesByEmail = async (email) => {
  const query = {
    text: 'SELECT workspaces FROM users WHERE email = $1',
    values: [email],
  };
  const result = await pool.query(query);
  if (result.rows.length === 0) {
    return null;
  }
  const workspaces = result.rows[0].workspaces;
  return workspaces;
};

exports.getChannelsByWorkspace = async (email, workspaceName) => {
  const query = {
    text: 'SELECT workspaces FROM users WHERE email = $1',
    values: [email],
  };
  const result = await pool.query(query);
  if (result.rows.length === 0) {
    return null;
  }
  const workspaces = result.rows[0].workspaces;
  const workspace = workspaces.find(ws => ws.name === workspaceName);
  if (!workspace) {
    throw new Error('Workspace not found');
  }
  return workspace.channels || [] ;
};

exports.addChannelToWorkspace = async (email, workspaceName, channelName) => {
  const selectQuery = {
      text: 'SELECT workspaces FROM users WHERE email = $1',
      values: [email],
  };
  const result = await pool.query(selectQuery);
  if (result.rows.length === 0) {
      throw new Error('User not found');
  }
  let workspaces = result.rows[0].workspaces;
  const workspaceIndex = workspaces.findIndex(ws => ws.name === workspaceName);
  if (workspaceIndex === -1) {
      throw new Error('Workspace not found');
  }
  if (!workspaces[workspaceIndex].channels) {
      workspaces[workspaceIndex].channels = [];
  }
  workspaces[workspaceIndex].channels.push(channelName);
  const updateQuery = {
      text: 'UPDATE users SET workspaces = $1 WHERE email = $2',
      values: [JSON.stringify(workspaces), email],
  };
  await pool.query(updateQuery);
};