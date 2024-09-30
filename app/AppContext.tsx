import React, { createContext, useState, useContext } from 'react';

// Create a context for the app's global state
const AppContext = createContext<any>(null);

// Create a provider component
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedValue, setSelectedValue] = useState<number>(1);

  return (
    <AppContext.Provider value={{ selectedValue, setSelectedValue }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
