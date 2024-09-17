import React, { createContext, useState, useContext } from 'react';

// Create a LoadingContext
const LoadingContext = createContext();

// Custom hook to use the LoadingContext
export const useLoading = () => useContext(LoadingContext);

// LoadingProvider component to wrap your app
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
