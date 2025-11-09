import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import WorkspaceContainer from '../components/WorkspaceContainer';
import {ContextProvider} from '../ContextProvider';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import LoggedInContext from '../LoggedInContext';
import SelectedWorkspaceContext from '../components/SelectedWorkspaceContext';
import {expect} from 'vitest';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


it('fetches channels', async () => {
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

  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() => expect(screen.getByText('# CSE186')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByText('# UCSC')).toBeInTheDocument());
});


it('fails fetches channels', async () => {
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 404,
  });
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return notFound;
      }),
  );

  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('creates channels', async () => {
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
      http.post('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return HttpResponse.json([
          {'id': '5a501ebe-5059-4bdd-911b-ec286f188771',
            'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
            'info': {
              'name': 'thisisatest',
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
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());

  fireEvent.click(screen.getByTestId('clickchannels'));
  fireEvent.click(screen.getByText('+ Add a new channel'));
  fireEvent.change(screen.getByLabelText('adding').querySelector('input'),
      {target: {value: 'thisisatest'}});
  fireEvent.click(screen.getByText('Add'));

  await waitFor(() =>
    expect(screen.getByText('# thisisatest')).toBeInTheDocument());
});


it('fails creates channels', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 404,
  });
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return HttpResponse.json([
          {'id': 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
            'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
            'info': {'name': 'CSE186'},
          },
        ]);
      }),
  );
  server.use(
      http.post('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return notFound;
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('clickchannels'));
  fireEvent.click(screen.getByText('+ Add a new channel'));
  fireEvent.change(screen.getByLabelText('adding').querySelector('input'),
      {target: {value: 'thisisatest'}});
  fireEvent.click(screen.getByText('Add'));
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('POSTing with 403', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 403,
  });
  const res1 = new HttpResponse([
    {'id': 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
      'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
      'info': {'name': 'CSE186'},
    },
  ]);
  const res2 = new HttpResponse([
    {'id': 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
      'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
      'info': {'name': 'CSE186'},
    },
  ]);
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return res1;
      }),
  );
  server.use(
      http.post('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return notFound;
      }),
  );
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return res2;
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('clickchannels'));
  fireEvent.click(screen.getByText('+ Add a new channel'));
  fireEvent.change(screen.getByLabelText('adding').querySelector('input'),
      {target: {value: 'thisisatest'}});
  fireEvent.click(screen.getByText('Add'));
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('GETING with 403', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 403,
  });
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return notFound;
      }),
  );
  server.use(
      http.post('http://localhost:3010/v0/users/userID/workspaces/:workspaceID/channels', async () => {
        return HttpResponse.json([
          {'id': '5a501ebe-5059-4bdd-911b-ec286f188771',
            'workspace_id': '9970731b-e9de-45a5-b4cb-198231f4abcb',
            'info': {
              'name': 'thisisatest',
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
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});


it('deletes a channel', async () => {
  const workspaceId = '27864707-300e-418e-bd96-118322a2ea7c';

  server.use(
      http.get(`http://localhost:3010/v0/users/userID/workspaces/:workspaceId/channels`, async () => {
        return HttpResponse.json([
          {
            'id': '2af37c35-4f69-424f-8199-225b475ab52b',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Research',
            },
          },
          {
            'id': '5c81e21e-7082-4b4e-a5c3-6d38c4c34a88',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Development',
            },
          },
          {
            'id': '7a0489d1-8f52-4a3c-92f3-df5d5b3d2566',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Marketing',
            },
          },
        ]);
      }),
  );

  server.use(
      http.delete(`http://localhost:3010/v0/channel/:id`, async () => {
        return HttpResponse.json([
          {
            'id': '6e209f0a-dcf8-48ec-9153-17cf58f4b602',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Development',
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
              {id: workspaceId,
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() =>
    expect(screen.queryByText('# Development')).toBeInTheDocument());
  const deleteButton = screen.getByTestId(`deleteChannelDevelopment`);
  fireEvent.click(deleteButton);
  await waitFor(() =>
    expect(screen.queryByText('# Development')).not.toBeInTheDocument());
});


it('fake deletes a channel', async () => {
  const workspaceId = '27864707-300e-418e-bd96-118322a2ea7c';
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 403,
  });
  server.use(
      http.get(`http://localhost:3010/v0/users/userID/workspaces/:workspaceId/channels`, async () => {
        return HttpResponse.json([
          {
            'id': '2af37c35-4f69-424f-8199-225b475ab52b',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Research',
            },
          },
          {
            'id': '5c81e21e-7082-4b4e-a5c3-6d38c4c34a88',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Development',
            },
          },
          {
            'id': '7a0489d1-8f52-4a3c-92f3-df5d5b3d2566',
            'workspace_id': '27864707-300e-418e-bd96-118322a2ea7c',
            'info': {
              'name': 'Marketing',
            },
          },
        ]);
      }),
  );

  server.use(
      http.delete(`http://localhost:3010/v0/channel/:id`, async () => {
        return notFound;
      }),
  );


  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace:
              {id: workspaceId,
                info: {name: 'WorkspaceOne'}}, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <WorkspaceContainer />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() =>
    expect(screen.queryByText('# Development')).toBeInTheDocument());
  const deleteButton = screen.getByTestId(`deleteChannelDevelopment`);
  fireEvent.click(deleteButton);

  await waitFor(() => {
    expect(notif).toBe(true);
  });
});
