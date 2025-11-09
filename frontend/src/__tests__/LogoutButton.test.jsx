import {render, screen, fireEvent} from '@testing-library/react';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';


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

it('testing logout', async () => {
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  localStorage.setItem('accessToken', JSON.stringify({id: '293729873827'}));
  render(
      <MemoryRouter>
        <ContextProvider>
          <LogoutButton />
        </ContextProvider>
      </MemoryRouter>,
  );
  fireEvent.click(screen.getByText('Logout'));
  expect(localStorage.getItem('accessToken')).toBeNull();
  expect(localStorage.getItem('userID')).toBeNull();
});
