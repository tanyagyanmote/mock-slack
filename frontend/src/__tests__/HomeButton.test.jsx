import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import WorkspaceContainer from '../components/WorkspaceContainer';
import {http, HttpResponse} from 'msw';
import LoggedInContext from '../LoggedInContext';
import SelectedWorkspaceContext from '../components/SelectedWorkspaceContext';

import {ContextProvider} from '../ContextProvider';
import {setupServer} from 'msw/node';
import {expect} from 'vitest';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.removeItem('userID');
});
afterAll(() => server.close());

it('testing Home Button', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return HttpResponse.json([
          {'id': 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
            'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
            'info': {
              'name': 'CSE186',
            },
          },
          {'id': '8ed30f43-ed07-45c1-9ce4-6214c8e7a3a9',
            'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
            'info': {
              'name': 'UCSC',
            },
          },
        ]);
      }),
  );

  server.use(
      http.get('http://localhost:3010/v0/channel/:id/message', async () => {
        return HttpResponse.json([
          {'id': '5625a8d0-0d88-4c43-b0d3-94fba9bf5875',
            'channel_id': 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
            'owner_id': 'da953f7e-4d08-4d12-b05e-a0f4526f1848',
            'info': {
              'msg': 'Hello CSE186',
              'timestamp': '2023-09-01T10:00:00Z',
              'from': 'Anna',
            },
          },
        ]);
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}},
            setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('clickchannels'));
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Hello CSE186')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('clickHome'));
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
});
