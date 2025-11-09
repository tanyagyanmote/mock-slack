import React, {useState, useEffect} from 'react';
import {Box, Typography, TextField, Button,
  List, ListItem, ListItemText, Collapse} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SelectedWorkspaceContext from './SelectedWorkspaceContext';
import SelectedChannelContext from './SelectedChannelContext';
import MessagesDialog from './MessageDialog';
import isDialogOpenContext from './isDialogOpenContext';

import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from '@mui/material';

/**
 *
 * @return {JSX.Element}
 */
function WorkspaceContainer() {
  const {selectedWorkspace} =
  React.useContext(SelectedWorkspaceContext);

  const {setSelectedChannel} =
  React.useContext(SelectedChannelContext);

  const {isDialogOpen, setIsDialogOpen} =
  React.useContext(isDialogOpenContext);

  const handleToggleChannels = () => {
    setChannelsOpen(!channelsOpen);
  };

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [showNewChannelInput, setShowNewChannelInput] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!selectedWorkspace) return;
    const fetchChannels = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/users/userID/workspaces/${selectedWorkspace.id}/channels`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          setChannels(json);
        } else {
          throw response;
        }
      } catch (error) {
        // console.error('Failed to fetch channels:', error);
        if (error.status == 403) {
          localStorage.removeItem('userID');
        }
        alert('Failed to fetch channels');
      }
    };
    fetchChannels();
  }, [selectedWorkspace, accessToken]);


  const createChannel = async (e) => {
    e.preventDefault();
    // if (!selectedWorkspace) {
    //   alert('Please select a workspace first.');
    //   return;
    // }
    try {
      const response = await fetch(`http://localhost:3010/v0/users/userID/workspaces/${(selectedWorkspace.id)}/channels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          channelName: newChannelName,
        }),
      });
      if (response.ok) {
        // fetchChannels();
        const json = await response.json();
        setChannels([...channels, json[0]]);
        setShowNewChannelInput(false);
        setNewChannelName('');
      } else {
        throw response;
      }
    } catch (error) {
      if (error.status == 403) {
        localStorage.removeItem('userID');
      }
      // console.error('Failed to create a new channel:', error);
      alert('Failed to create channels');
    }
  };

  const deleteChannel = async (channelId) => {
    try {
      const response = await fetch(`http://localhost:3010/v0/channel/${channelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        setChannels(channels.filter((channel) => channel.id !== channelId));
      } else {
        // Handle failure
        throw response;
      }
    } catch (error) {
      alert('Error deleting channel');
    }
  };

  // React.useEffect(() => {
  //   if (selectedWorkspace) {
  //     fetchChannels();
  //   }
  // }, [selectedWorkspace]);


  return (
    <div>
      {selectedWorkspace ? (
        <Box sx={{padding: 2}}>
          <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}
            aria-label="clickchannels" data-testid="clickchannels"
            id = "clickchannels"
            onClick={handleToggleChannels} >
            <Typography id = "testChannel"
              variant="h6" sx={{mr: 1}}>Channels</Typography>
            {channelsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>
          <Collapse in={channelsOpen}>
            <List>
              {channels && channels.map((channel, index) => (
                // <ListItem key={index} button onClick={() => {
                //   setSelectedChannel(channel);
                //   setIsDialogOpen(true);
                // }} aria-label="clickChannel"
                // data-testid={`clickChannel${channel.info.name}`}
                // id = {`clickChannel${channel.info.name}`} >
                //   <ListItemText primary={`# ${channel.info.name}`} />
                // </ListItem>
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={(e) => {
                      e.stopPropagation();
                      deleteChannel(channel.id);
                    }}
                    data-testid = {`deleteChannel${channel.info.name}`}
                    id = {`deleteChannel${channel.info.name}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  button onClick={() => {
                    setSelectedChannel(channel);
                    setIsDialogOpen(true);
                  }} aria-label="clickChannel"
                  data-testid={`clickChannel${channel.info.name}`}
                  id={`clickChannel${channel.info.name}`}>
                  <ListItemText primary={`# ${channel.info.name}`} />
                </ListItem>
              ))}
              <ListItem onClick={() => setShowNewChannelInput(
                  !showNewChannelInput)} aria-label="newchannel"
              data-testid="newchannel" id = "newchannel">
                <ListItemText id = "addChannel" primary="+ Add a new channel" />
              </ListItem>
            </List>
            {showNewChannelInput && (
              <Box sx={{display: 'flex', alignItems: 'center', mt: 2}}>
                <TextField
                  label="Channel Name"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  size="small"
                  sx={{mr: 1}}
                  aria-label="adding" data-testid='adding'
                  id = "adding"
                />
                <Button variant="contained"
                  color="primary" onClick={createChannel}
                  id = "add">
                  Add
                </Button>
              </Box>
            )}
          </Collapse>
        </Box>
      ) : (
        <Typography variant="h6" sx={{padding: 2, textAlign: 'center'}}>
          Please select a workspace to continue.
        </Typography>
      )}
      <MessagesDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

export default WorkspaceContainer;
