import HomePage from '../components/HomePage';
import LoggedInContext from '../LoggedInContext';
import SelectedWorkspaceContext from '../components/SelectedWorkspaceContext';
import SelectedChannelContext from '../components/SelectedChannelContext';
import isDialogOpenContext from '../components/isDialogOpenContext';
import {render} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import {setupServer} from 'msw/node';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {http, HttpResponse} from 'msw';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('Renders Homepage', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
  render(
      <MemoryRouter>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace: null, setSelectedWorkspace: () => {}}}>
            <SelectedChannelContext.Provider
              value={{selectedChannel: {}, setSelectedChannel: () => {}}}>
              <isDialogOpenContext.Provider
                value={{isDialogOpen: false, setisDialogOpen: () => {}}}>
                <HomePage />
              </isDialogOpenContext.Provider>
            </SelectedChannelContext.Provider>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </MemoryRouter>,
  );
});
