import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import Navbar from '../components/Navbar';
import SignUp from '../components/SignUp';
import {ContextProvider} from '../ContextProvider';
import {setupServer} from 'msw/node';
import {http, HttpResponse} from 'msw';
import LoggedInContext from '../LoggedInContext';
import SelectedWorkspaceContext from '../components/SelectedWorkspaceContext';
import {expect} from 'vitest';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.removeItem('userID');
});
afterAll(() => server.close());

it('fetches workspaces on component mount', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
          {id: '27864707-300e-418e-bd96-118322a2ea7c',
            info: {name: 'WorkspaceTwo'}},
          {id: 'f369341c-1089-40bd-808f-c2f7736edce5',
            info: {name: 'WorkspaceThree'}},
        ]);
      }),
  );

  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <SelectedWorkspaceContext.Provider
            value={{selectedWorkspace: null, setSelectedWorkspace: () => {}}}>
            <MemoryRouter>
              <Navbar />
            </MemoryRouter>
          </SelectedWorkspaceContext.Provider>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() =>
    expect(screen.getByText('WorkspaceOne')).toBeInTheDocument());
  await waitFor(() =>
    expect(screen.getByText('WorkspaceTwo')).toBeInTheDocument());
  await waitFor(() =>
    expect(screen.getByText('WorkspaceThree')).toBeInTheDocument());
});

it('creates a new workspace and updates workspace list', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
          {id: '27864707-300e-418e-bd96-118322a2ea7c',
            info: {name: 'WorkspaceTwo'}},
          {id: 'f369341c-1089-40bd-808f-c2f7736edce5',
            info: {name: 'WorkspaceThree'}},
        ]);
      }),
  );
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.post('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json({id: 'a9316497-404f-4315-a879-af8aff45f929',
          info: {name: 'newWorkspace'}});
      }),
  );

  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() =>
    expect(screen.getByText('Create Workspace')).toBeInTheDocument());

  fireEvent.change(screen.getByLabelText('New Workspace Name'),
      {target: {value: 'newWorkspace'}});
  const button = screen.getByText('Create Workspace');
  fireEvent.click(button);
  await waitFor(() => {
    const text = screen.getAllByText('newWorkspace');
    expect(text[0]).toBeInTheDocument();
  });
});

it('handles error when fetching workspaces fails', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 404,
  });
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return notFound;
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );

  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('handles error when creating workspaces fails', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 404,
  });
  server.use(
      http.get(`http://localhost:3010/v0/users/:userID/workspaces`, async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.post(`http://localhost:3010/v0/users/:userID/workspaces`, async () => {
        return notFound;
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText('Create Workspace')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('New Workspace Name'),
      {target: {value: 'newWorkspace'}});
  const button = screen.getByText('Create Workspace');
  fireEvent.click(button);
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});


it('opens and selects a workspace from the dropdown', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
          {id: '27864707-300e-418e-bd96-118322a2ea7c',
            info: {name: 'WorkspaceTwo'}},
          {id: 'f369341c-1089-40bd-808f-c2f7736edce5',
            info: {name: 'WorkspaceThree'}},
        ]);
      }),
  );

  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  fireEvent.click(screen.getByTestId('clickopen'));
  await waitFor(() => {
    const text = screen.getAllByText('WorkspaceOne');
    expect(text[0]).toBeInTheDocument();
  });
});

it('opens and closes selects a workspace from the dropdown', async () => {
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
          {id: '27864707-300e-418e-bd96-118322a2ea7c',
            info: {name: 'WorkspaceTwo'}},
          {id: 'f369341c-1089-40bd-808f-c2f7736edce5',
            info: {name: 'WorkspaceThree'}},
        ]);
      }),
  );
  render(
      <ContextProvider>
        <LoggedInContext.Provider value={{loggedIn: true}}>
          <MemoryRouter>
            <Navbar />
          </MemoryRouter>
        </LoggedInContext.Provider>
      </ContextProvider>,
  );
  fireEvent.click(screen.getByTestId('clickopen'));
  await waitFor(() => {
    const text = screen.getAllByText('WorkspaceOne');
    expect(text[0]).toBeInTheDocument();
  });
  fireEvent.click(screen.getByTestId('clickcloseWorkspaceOne'));
  await waitFor(() => {
    const text = screen.getAllByText('WorkspaceOne');
    expect(text[0]).toBeInTheDocument();
  });
});

it('checks if im logged in, goes to sign in page', async () => {
  render(
      <ContextProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/" exact element={<Navbar />}/>
          </Routes>
        </MemoryRouter>
      </ContextProvider>,
  );
  await waitFor(() => expect(screen.getByText('Login')).toBeInTheDocument());
});

it('checks if im logged in, goes to sign in page', async () => {
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/" exact element={<Navbar />}/>
          </Routes>
        </MemoryRouter>
      </ContextProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText('Create Workspace')).toBeInTheDocument());
});


it('GETing with 403', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const notFound = new HttpResponse('not found', {
    status: 403,
  });
  localStorage.setItem('userID', {id: '12987'});
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return notFound;
      }),
  );
  server.use(
      http.post(`http://localhost:3010/v0/users/:userID/workspaces`, async () => {
        return HttpResponse.json({id: 'a9316497-404f-4315-a879-af8aff45f929',
          info: {name: 'newWorkspace'}});
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/" exact element={<Navbar />}/>
          </Routes>
        </MemoryRouter>
      </ContextProvider>,
  );
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
  localStorage.setItem('userID', {id: '17982'});
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
  server.use(
      http.post(`http://localhost:3010/v0/users/:userID/workspaces`, async () => {
        return notFound;
      }),
  );
  server.use(
      http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
        return HttpResponse.json([
          {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
            info: {name: 'WorkspaceOne'}},
        ]);
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/" exact element={<Navbar />}/>
          </Routes>
        </MemoryRouter>
      </ContextProvider>,
  );
  await waitFor(() =>
    expect(screen.getByText('Create Workspace')).toBeInTheDocument());
  fireEvent.change(screen.getByLabelText('New Workspace Name'),
      {target: {value: 'newWorkspace'}});
  const button = screen.getByText('Create Workspace');
  fireEvent.click(button);
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});

it('checks if im logged in, goes to homepage checks for "Hello {name}',
    async () => {
      localStorage.setItem('name', 'John Doe');
      server.use(
          http.get('http://localhost:3010/v0/users/:userID/workspaces', async () => {
            return HttpResponse.json([
              {id: '9970731b-e9de-45a5-b4cb-198231f4abcb',
                info: {name: 'WorkspaceOne'}},
            ]);
          }),
      );
      render(
          <ContextProvider>
            <LoggedInContext.Provider value={{loggedIn: true}}>
              <SelectedWorkspaceContext.Provider
                value={{selectedWorkspace: null,
                  setSelectedWorkspace: () => {}}}>
                <MemoryRouter>
                  <Navbar />
                </MemoryRouter>
              </SelectedWorkspaceContext.Provider>
            </LoggedInContext.Provider>
          </ContextProvider>,
      );
      expect(await screen.findByText('Hello, John Doe')).toBeInTheDocument();
    });
