import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState(null); // Initialize user as null

    const setUserEmail = (email) => {
        setUser({ ...user, email });
    };

    const value = {
      isLoggedIn,
      setIsLoggedIn,
      user,
      setUserEmail,
    };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export { AuthContext };
