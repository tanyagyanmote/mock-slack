import React, {useEffect, useState} from 'react';
import {Dialog, List, ListItem, Typography} from '@mui/material';
import SelectedChannelContext from './SelectedChannelContext';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LogoutButton from './LogoutButton';
import HomeButton from './HomeButton';
import PropTypes from 'prop-types';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @return {React.ReactElement}
 *  */
function MessagesDialog({open, onClose}) {
  const {selectedChannel} =
    React.useContext(SelectedChannelContext);
  const [messages, setMessages] = useState([]);
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchMessages = async () => {
      // if (!selectedChannel.id) return;
      try {
        const response = await fetch(`http://localhost:3010/v0/channel/${selectedChannel.id}/message`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const json = await response.json();
          // const sortedMessages =
          // json.sort((a, b) =>
          // new Date(a.info.timestamp) - new Date(b.info.timestamp));
          setMessages(json);
        } else {
          throw response;
        }
      } catch (error) {
        // console.error("Failed to fetch messages:", error);
        // console.log(error)
        if (error.status == 403) {
          localStorage.removeItem('userID');
        }
        alert('Failed to fetch messages');
      }
    };

    if (selectedChannel && selectedChannel.id) {
      fetchMessages();
    }
  }, [selectedChannel, accessToken]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    const options = {month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', hour12: true};
    const formattedDate =
      new Intl.DateTimeFormat('en-US', options).format(date);

    const dayOfMonth = date.getDate();
    let daySuffix;

    if (dayOfMonth > 3 && dayOfMonth < 21) daySuffix = 'th';
    else if (dayOfMonth % 10 === 1) daySuffix = 'st';
    else if (dayOfMonth % 10 === 2) daySuffix = 'nd';
    else if (dayOfMonth % 10 === 3) daySuffix = 'rd';
    else daySuffix = 'th';

    return formattedDate.replace(` ${dayOfMonth}`,
        ` ${dayOfMonth}${daySuffix}`);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{position: 'relative'}}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose}
              aria-label="closeMessages" data-testid='closeMessages'>
              <CloseIcon />
            </IconButton>
            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
              Message Thread
            </Typography>
            <LogoutButton />
            <HomeButton />
          </Toolbar>
        </AppBar>
        <List>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={`${message.info.from} - 
                  ${formatDate(message.info.timestamp)}`}
                  secondary={message.info.msg}
                  id = {`${message.info.msg}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Dialog>
    </React.Fragment>
  );
}

MessagesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessagesDialog;
