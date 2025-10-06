/*
 * Copyright (C) 2022-2024 David C. Harrison. All right reserved.
 *
 * You may not use, distribute, publish, or modify this code without
 * the express written permission of the copyright holder.
 */
import Dummy from './components/Dummy';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import { AuthProvider } from './AuthContext'; // Adjust path as necessary

import { BrowserRouter, Routes, Route } from 'react-router-dom';

/**
 * Simple component with no state.
 *
 * @return {object} JSX
 */
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
