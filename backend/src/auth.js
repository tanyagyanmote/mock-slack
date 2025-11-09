const db = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secrets = require('./secrets.json');

exports.login = async (req, res) => {
  const login = await db.login(req.body.email);
  if (!login) {
    return res.status(401).send();
  }
  const match = bcrypt.compareSync(req.body.password, login.info.password);
  if (match) {
    const accessToken = jwt.sign(
      {email: login.info.email,
        username: login.info.username,
        userID: login.id},
      secrets.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    return res.status(200).json(
      {email: login.info.email,
        name: login.info.username,
        accessToken: accessToken,
        userID: login.id});
  } else {
    return res.status(401).send();
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // if (authHeader) {
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send();
    }
    req.user = user;
    next();
  });
  // }
  // else {
  //   res.status(401).send();
  // }
};


exports.getWorkspace = async (req, res) => {
  const userID = req.params.userID;
  const workspaces = await db.getUserWorkspacesByID(userID);
  if (!workspaces) {
    return res.status(404).send();
  }
  res.json(workspaces);
};

exports.postWorkspace = async (req, res) => {
  const userID = req.params.userID;
  const workspaceData = req.body;
  const workspaces = await db.addWorkspaceToUser(userID, workspaceData);
  if (!workspaces) {
    return res.status(404).send();
  }
  res.status(200).json(workspaces);
};

exports.getChannels = async (req, res) => {
  const {workspaceID} = req.params;
  const channels = await db.getChannelsByWorkspace(workspaceID);
  // if (!channels) {
  //   return res.status(404).send();
  // }
  res.status(200).json(channels);
};

exports.postChannel = async (req, res) => {
  const {workspaceID} = req.params;
  const {channelName} = req.body;
  const data = {
    name: channelName,
  };
  const channels = await db.addChannelToWorkspace(workspaceID, data);
  // if (!channels) {
  //   return res.status(404).send();
  // }
  res.status(201).json(channels);
};

exports.getMessages = async (req, res) => {
  const channelID = req.params.id;
  const channels = await db.getMessagesByChannel(channelID);
  // if (!channels) {
  //   return res.status(404).send();
  // }
  res.status(200).json(channels);
};

exports.deleteChannel = async (req, res) => {
  const channelID = req.params.id;
  const deletedChannel = await db.deleteChannelFromWorkspace(channelID);
  // if (!deletedChannel) {
  //   return res.status(404).send('Channel not found');
  // }
  res.status(200).json(deletedChannel);
};
