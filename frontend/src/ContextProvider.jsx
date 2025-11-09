import React, {useState} from 'react';
import LoggedInContext from './LoggedInContext';
import SelectedWorkspaceContext from './components/SelectedWorkspaceContext';
import SelectedChannelContext from './components/SelectedChannelContext';
import isDialogOpenContext from './components/isDialogOpenContext';
import PropTypes from 'prop-types';

export const ContextProvider = ({children}) => {
  const [loggedIn, setLoggedIn] =
    React.useState(localStorage.getItem('userID') ? true : false);
  const [selectedWorkspace, setSelectedWorkspace] = useState();
  const [selectedChannel, setSelectedChannel] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  return (
    <LoggedInContext.Provider value={{loggedIn, setLoggedIn}}>
      <SelectedWorkspaceContext.Provider
        value={{selectedWorkspace, setSelectedWorkspace}}>
        <SelectedChannelContext.Provider
          value = {{selectedChannel, setSelectedChannel}}>
          <isDialogOpenContext.Provider
            value = {{isDialogOpen, setIsDialogOpen}}>
            {children}
          </isDialogOpenContext.Provider>
        </SelectedChannelContext.Provider>
      </SelectedWorkspaceContext.Provider>
    </LoggedInContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.any,
};
