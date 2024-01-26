"use client"

import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  userName: string | undefined;
  updateUserName: (newName: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
};

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const updateUserName = (newName: string) => {
    setUserName(newName);
  };

  return (
    <UserContext.Provider value={{ userName, updateUserName }}>
      {children}
    </UserContext.Provider>
  );
};
