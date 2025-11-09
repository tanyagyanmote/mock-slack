import React, {useEffect, useState} from 'react';
import {Box, Toolbar,
  Typography, TextField, Button, Menu, MenuItem} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SelectedWorkspaceContext from './SelectedWorkspaceContext';
import LoggedInContext from '../LoggedInContext';
import {AppBar} from '@mui/material';

/**
 * Navbar component for the application.
 * @return {JSX.Element} The rendered navbar component.
 */
function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const {selectedWorkspace, setSelectedWorkspace} =
   React.useContext(SelectedWorkspaceContext);
  const {loggedIn} = React.useContext(LoggedInContext);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const accessToken = localStorage.getItem('accessToken');
  const userID = localStorage.getItem('userID');
  const name = localStorage.getItem('name');

  const createWorkspace = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3010/v0/users/${userID}/workspaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,

        },
        body: JSON.stringify({
          name: newWorkspaceName,
        }),
      });
      if (response.ok) {
        const newWorkspace = await response.json();
        setWorkspaces([...workspaces, newWorkspace]);
        // setNewWorkspaceName('');
        setSelectedWorkspace(newWorkspace);
      } else {
        throw response;
      }
    } catch (error) {
      // console.error('Failed to create a new Workspace:', error);
      if (error.status == 403) {
        localStorage.removeItem('userID');
      }
      alert('Failed to create workspace');
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch(`http://localhost:3010/v0/users/${userID}/workspaces`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setWorkspaces(data);
          if (data.length > 0 && !selectedWorkspace) {
            setSelectedWorkspace(data[0]);
          }
        } else {
          throw response;
        }
      } catch (error) {
        // console.error('Failed to fetch workspaces:', error);
        if (error.status == 403) {
          localStorage.removeItem('userID');
        }
        alert('Failed to fetch workspace');
      }
    };
    fetchWorkspaces();
  }, [loggedIn, accessToken, selectedWorkspace, setSelectedWorkspace, userID]);


  useEffect(() => {
    if (!loggedIn) navigate('/signup');
  }, [loggedIn, navigate]);

  // useEffect(() => {
  //   if (loggedIn) {
  //     fetchWorkspaces();
  //   }
  // }, [loggedIn]);

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h7"
            aria-label = "selectedworkspace"
            sx={{flexGrow: 1, display: 'flex', alignItems: 'center'}}>
            {selectedWorkspace && selectedWorkspace.info.name}
            <ArrowDropDownIcon onClick={handleMenuClick}
              aria-label="clickopen" data-testid="clickopen" id = "clickopen"
              sx={{cursor: 'pointer', ml: 1}}/>
          </Typography>
          <Menu
            id="workspace-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {workspaces.map((workspace, index) => (
              <MenuItem key={index} aria-label="clickclose"
                data-testid={`clickclose${workspace.info.name}`}
                id={`clickclose${workspace.info.name}`}
                onClick={() => {
                  setSelectedWorkspace(workspace);
                  handleMenuClose();
                }}
              >
                {workspace.info.name}
              </MenuItem>
            ))}
          </Menu>

          {/* {name && (
            <Typography variant="h6" sx={{display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'}}>
              Hello, {name}
            </Typography>
          )} */}

          <Box sx={{flexGrow: 2, display: 'flex', justifyContent: 'center'}}>
            {name && (
              <Typography variant="h7">
                Hello, {name}
              </Typography>
            )}
          </Box>

          <TextField
            label="New Workspace Name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              'marginRight': 2,
              'fontSize': '0.75rem',
              '& .MuiInputBase-input': {
                fontSize: '0.75rem',
              },
              '& .MuiOutlinedInput-root': {
                padding: '3px 14px',
              },
              '& .MuiInputLabel-root': {
                fontSize: '0.75rem',
              },
            }}
            id = "createWorkspace"
          />
          <Button variant="contained" color="grey"
            onClick={createWorkspace} id = "postWorkspace"
            size="small"
            sx={{
              fontSize: '0.75rem',
              padding: '4px 8px',
            }}
          >
          Create Workspace
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;
