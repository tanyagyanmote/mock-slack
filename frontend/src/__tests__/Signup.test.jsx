import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import SignUp from '../components/SignUp';
import {it, beforeAll, afterAll, afterEach} from 'vitest';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import {ContextProvider} from '../ContextProvider';
import {expect} from 'vitest';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 */

it('Checking if submit works', async () => {
  localStorage.setItem('userID', JSON.stringify({id: '1234'}));
  server.use(
      http.post('http://localhost:3010/v0/login', async () => {
        return HttpResponse.json({status: 200});
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </ContextProvider>,
  );
  const inputEmail = screen.getByLabelText('email').querySelector('input');
  const inputPass = screen.getByLabelText('password').querySelector('input');
  fireEvent.change(inputEmail, {target: {value: 'anna@books'}});
  fireEvent.change(inputPass, {target: {value: 'annaadmin'}});
  fireEvent.click(screen.getByText('Sign In'));
  expect(localStorage.getItem('user')).toBeDefined();
});

it('Checking if submit DOESN\'T work', async () => {
  let notif = false;
  window.alert = () => {
    notif = true;
  };
  const wrong = new HttpResponse('wrong', {
    status: 404, body: 'Login Failed:',
  });
  server.use(
      http.post('http://localhost:3010/v0/login', async () => {
        return wrong;
      }),
  );
  render(
      <ContextProvider>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </ContextProvider>,
  );
  const inputEmail = screen.getByLabelText('email').querySelector('input');
  const inputPass = screen.getByLabelText('password').querySelector('input');
  fireEvent.change(inputEmail, {target: {value: 'fakeemail@books'}});
  fireEvent.change(inputPass, {target: {value: 'badpassword'}});
  fireEvent.click(screen.getByText('Sign In'));
  expect(localStorage.getItem('user')).toBeNull();
  await waitFor(() => {
    expect(notif).toBe(true);
  });
});
