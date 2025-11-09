import {Box} from '@mui/material';
import WorkspaceContainer from './WorkspaceContainer';
import Navbar from './Navbar';
import LogoutButton from './LogoutButton';
import HomeButton from './HomeButton';


/**
 * Renders the home page.
 * @return {JSX.Element} The rendered home page component.
 */
export default function HomePage() {
  return (
    <Box sx={{flexGrow: 1}}>
      <Navbar />
      <WorkspaceContainer />
      <LogoutButton />
      <HomeButton />
    </Box>
  );
}
