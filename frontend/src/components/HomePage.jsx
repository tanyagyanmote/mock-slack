import React, { useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, TextField, Button, List, ListItem, ListItemText, Menu, MenuItem, Collapse} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { AuthContext, useAuth } from '../AuthContext';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';


export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth(); // Destructure to get user object
  const encodedEmail = encodeURIComponent(user?.email);
  const [workspaces, setWorkspaces] = useState([]); // Correctly declare workspaces here
  const [newWorkspaceName, setNewWorkspaceName] = useState(''); // State for new channel name
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [channels, setChannels] = useState([]);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [showNewChannelInput, setShowNewChannelInput] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleChannels = () => {
    setChannelsOpen(!channelsOpen);
  };
  
  const selectWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    fetchChannels(workspace.name); // Fetch channels for the selected workspace
    handleMenuClose();
  };

  useEffect(() => {
    if (!isLoggedIn) navigate('/signup');
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchWorkspaces();
    }
  }, [isLoggedIn, user?.email]); 

  const fetchWorkspaces = async () => {
    try {
        const response = await fetch(`http://localhost:3010/v0/users/${encodedEmail}/workspaces`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            setWorkspaces(data);
            if (data.length > 0 && !selectedWorkspace) {
              setSelectedWorkspace(data[0]);
            }
        }
    } catch (error) {
        console.error("Failed to fetch workspaces:", error);
    }
  };

  const fetchChannels = async (workspaceName) => {
    try {
      const response = await fetch(`http://localhost:3010/v0/users/${encodedEmail}/workspaces/${encodeURIComponent(workspaceName)}/channels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const { channels } = await response.json();
        setChannels(channels); // Update state with fetched channels
      }
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  };

  const createWorkspace = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    try {
      const response = await fetch(`http://localhost:3010/v0/users/${encodedEmail}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newWorkspaceName,
        }),
      });
      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]); // Update the workspaces state to include the new channel
        setNewWorkspaceName(''); // Reset the input field
        selectWorkspace(newWorkspace); // Automatically select the new workspace
      }
    } catch (error) {
      console.error("Failed to create a new Workspace:", error);
    }
  };

  const createChannel = async (e) => {
    e.preventDefault();
    if (!selectedWorkspace) {
      alert('Please select a workspace first.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3010/v0/users/${encodedEmail}/workspaces/${(encodeURIComponent(selectedWorkspace.name))}/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName: newChannelName,
        }),
      });
      if (response.ok) {
        fetchChannels(selectedWorkspace.name);
        setShowNewChannelInput(false);
        setNewChannelName('');
      } else {
        console.error("Failed to create a new channel");
      }
    } catch (error) {
      console.error("Failed to create a new channel:", error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="home">
            <HomeIcon />
          </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {selectedWorkspace?.name}
          <ArrowDropDownIcon onClick={handleMenuClick} sx={{ cursor: 'pointer', ml: 1 }} />
        </Typography>
        <Menu
          id="workspace-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {workspaces.map((workspace) => (
            <MenuItem key={workspace.id} onClick={() => selectWorkspace(workspace)}>
              {workspace.name}
            </MenuItem>
          ))}
        </Menu>

        <TextField
            label="New Workspace Name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ marginRight: 2 }}
          />
          <Button variant="contained" color="grey" onClick={createWorkspace}>
            Create Workspace
          </Button>

        </Toolbar>
      </AppBar>
      {selectedWorkspace ? (
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleToggleChannels}>
          <Typography variant="h6" sx={{ mr: 1 }}>Channels</Typography>
          {channelsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        <Collapse in={channelsOpen}>
          <List>
            {channels.map((channel, index) => (
              <ListItem key={index}>
                <ListItemText primary={`# ${channel}`} />
              </ListItem>
            ))}
            <ListItem button onClick={() => setShowNewChannelInput(!showNewChannelInput)}>
              <ListItemText primary="+ Add a new channel" />
            </ListItem>
          </List>
          {showNewChannelInput && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <TextField
                label="Channel Name"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                size="small"
                sx={{ mr: 1 }}
              />
              <Button variant="contained" color="primary" onClick={createChannel}>
                Add
              </Button>
            </Box>
          )}
        </Collapse>
    </Box>
    ) : (
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center' }}>
        Please select a workspace to continue.
      </Typography>
    )}
    </Box>
  );
}