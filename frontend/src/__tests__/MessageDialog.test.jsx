import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import WorkspaceContainer from '../components/WorkspaceContainer';
import {ContextProvider} from '../ContextProvider';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import LoggedInContext from '../LoggedInContext';
import SelectedWorkspaceContext from '../components/SelectedWorkspaceContext';
import SelectedChannelContext from '../components/SelectedChannelContext';
import {expect} from 'vitest';
import MessagesDialog from '../components/MessageDialog';
import HomePage from '../components/HomePage';
import SignUp from '../components/SignUp';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('fetches messages FAILS', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 404,
  });
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/channel/:id/message', async () => {
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
            <SelectedChannelContext.Provider
              value={{selectedChannel:
                {id: 'e3cdbc28-4a78-4672-9778-4fae87d8dec8',
                  info: {name: 'CSE186'}}, setSelectedWorkspace: () => {}}}>
              <MemoryRouter>
                <MessagesDialog open={true} onClose={() => {}}/>
              </MemoryRouter>
            </SelectedChannelContext.Provider>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('fetches messages 403', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 403,
  });
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
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
        return notFound;
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/" exact element={<HomePage />}/>
          </Routes>
        </MemoryRouter>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('clickchannels'));
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('creates channels and clicks on a certain one', async () => {
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Hello CSE186')).toBeInTheDocument());
});

it('formats date with \'nd\' suffix correctly', async () => {
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
              'msg': 'Message with nd suffix',
              'timestamp': '2023-02-22T10:00:00Z',
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Message with nd suffix')).toBeInTheDocument());
});

it('formats date with \'rd\' suffix correctly', async () => {
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
              'msg': 'Message with rd suffix',
              'timestamp': '2023-03-23T10:00:00Z',
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Message with rd suffix')).toBeInTheDocument());
});


it('formats date with \'nd\' suffix correctly', async () => {
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
              'msg': 'Message with nd suffix',
              'timestamp': '2023-02-22T10:00:00Z',
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Message with nd suffix')).toBeInTheDocument());
});

it('formats date with \'th\' suffix correctly', async () => {
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
              'msg': 'Message with th suffix',
              'timestamp': '2023-04-24T10:00:00Z',
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Message with th suffix')).toBeInTheDocument());
});

it('formats dates between the 4th and 20th with \'th\' suffix correctly',
    async () => {
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
                  'msg': 'Testing \'th\' suffix',
                  'timestamp': '2023-04-04T10:00:00Z',
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
      await waitFor(() =>
        expect(screen.getByText('Channels')).toBeInTheDocument());
      fireEvent.click(screen.getByTestId('clickchannels'));
      await waitFor(() => {
        const text = screen.getAllByText('# CSE186');
        expect(text[0]).toBeInTheDocument();
      });
      fireEvent.click(screen.getByTestId('clickChannelCSE186'));
      await waitFor(() =>
        expect(screen.getByText('Testing \'th\' suffix')).toBeInTheDocument());
    });


it('CLICKING back button after messages opens', async () => {
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
  await waitFor(() => {
    const text = screen.getAllByText('# CSE186');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickChannelCSE186'));
  await waitFor(() =>
    expect(screen.getByText('Hello CSE186')).toBeInTheDocument());
  fireEvent.click(screen.getByTestId('closeMessages'));
  await waitFor(() => expect(screen.getByText('Channels')).toBeInTheDocument());
});
