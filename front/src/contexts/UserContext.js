// src/contexts/UserContext.js
import { createContext, useContext } from 'react';

export const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  return context?.loggedInUser || null;
};
