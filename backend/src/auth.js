const db = require('./db');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const login = await db.login(req.body.email);
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
      return res.status(200).json({name: login.username, accessToken: accessToken})
    } else {
        return res.status(401).send()
    }
};

exports.check = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
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
    const { email } = req.params;
    // try {
        const workspaces = await db.getUserWorkspacesByEmail(email);
        if (!workspaces) {
            return res.status(404).send();
        }
        res.json(workspaces);
    // } catch (error) {
    //     res.status(500).send();
    // }
};

exports.postWorkspace = async (req, res) => {
    const { email } = req.params;
    const workspaceData = req.body;
    const workspaces = await db.addWorkspaceToUser(email, workspaceData);
    if (!workspaces) {
        return res.status(404).send();
    }
    res.status(200).send('Workspace added successfully');
};

exports.getChannels = async (req, res) => {
    const { email, workspaceName } = req.params;
    try {
        const channels = await db.getChannelsByWorkspace(email, workspaceName);
        if (!channels) {
            return res.status(404).send();
        }
        const response = { channels: channels };
        res.json(response);
    } catch (error) {
        res.status(500).send();
    }
};

exports.postChannel = async (req, res) => {
    const { email, workspaceName } = req.params;
    const { channelName } = req.body; // Assume the name of the new channel is sent in the request body
    // try {
        await db.addChannelToWorkspace(email, workspaceName, channelName);
        res.status(200).send('Channel added successfully');
    // } catch (error) {
    //     console.log(error)
    //     if (error.message === 'User not found') {
    //         res.status(404).send('User not found');
    //     } else {
    //     console.error('Error adding channel:', error);
    //     res.status(500).send('Error adding channel');
    //     }
    // }
};