import React, { createContext, useContext } from 'react';
import { useCat } from './useCat';

const CatContext = createContext<ReturnType<typeof useCat> | null>(null);

export const CatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cat = useCat();
  return <CatContext.Provider value={cat}>{children}</CatContext.Provider>;
};

export function useCatContext() {
  const ctx = useContext(CatContext);
  if (!ctx) throw new Error('useCatContext must be used within a CatProvider');
  return ctx;
} 