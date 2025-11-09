import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userID');
    navigate('/signup');
  };

  return (
    <Button
      onClick={handleLogout}
      color="primary"
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
      aria-label="logout"
      data-testid="logout"
      id = "logout"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
