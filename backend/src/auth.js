const db = require('./db');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const login = await db.login(req.body.email, req.body.password);
    if(!login){
        return res.status(401).send()
    }
    const match = bcrypt.compareSync(req.body.password, login.password);
    if (match) {
    const accessToken = jwt.sign(
      { email: login.email, username: login.username },
      process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '30m',
        algorithm: 'HS256'
      });
      return res.status(200).json({name: login.name, accessToken: accessToken})
    } else {
        return res.status(401).send()
    }
};

exports.Workspace = async (req, res) => {
  const userEmail = req.params.email;
  const workspaceData = req.body;
  try {
    await db.addWorkspaceToUser(userEmail, workspaceData);
    res.status(200).send('Workspace added successfully');
  } catch (error) {
    console.error('Error adding workspace:', error);
    res.status(500).send('Error adding workspace');
  }
};

exports.getWorkspace = async (req, res) => {
    const { email } = req.params;
    try {
        const workspaces = await db.getUserWorkspacesByEmail(email);
        res.json(workspaces);
    } catch (error) {
        console.error('Error fetching workspaces:', error);
        res.status(500).send('Error fetching workspaces');
    }
  };


exports.check = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }
        req.user = user;
        next();
      });
      
    } else {
      res.status(401).json({ message: "Unauthorized: No token provided" });
    }
};

exports.getChannels = async (req, res) => {
    const { email, workspaceName } = req.params;
    try {
        const channels = await db.getChannelsByWorkspace(email, workspaceName);
        const response = { channels: channels };
        res.json(response);
    } catch (error) {
        res.status(500).send();
    }
};

exports.postChannel = async (req, res) => {
    const { email, workspaceName } = req.params;
    const { channelName } = req.body; // Assume the name of the new channel is sent in the request body
    try {
        await db.addChannelToWorkspace(email, workspaceName, channelName);
        res.status(200).send('Channel added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding channel');
    }
};