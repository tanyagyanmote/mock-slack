import React from 'react';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import isDialogOpenContext from './isDialogOpenContext';
import SelectedChannelContext from './SelectedChannelContext';

const HomeButton = () => {
  const navigate = useNavigate();
  const {setIsDialogOpen} =
    React.useContext(isDialogOpenContext);
  const {selectedChannel, setSelectedChannel} =
    React.useContext(SelectedChannelContext);

  const isChannelSelected =
    selectedChannel && Object.keys(selectedChannel).length > 0;

  const handleGoHome = () => {
    navigate('/');
    setIsDialogOpen(false);
    setSelectedChannel(null);
  };

  return (
    <Button
      onClick={handleGoHome}
      disabled={!isChannelSelected}
      variant="contained"
      color="primary"
      style={{
        position: 'fixed',
        bottom: 20,
        left: 20,
      }}
      aria-label="clickHome"
      data-testid = "clickHome"
      id = "clickHome"
    >
            Home
    </Button>
  );
};

export default HomeButton;
