import { createContext, useContext, useState, type ReactNode } from 'react';

interface DebugContextType {
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  debugLog: (...args: any[]) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }) {
  const [debugMode, setDebugMode] = useState(() => {
    // Check localStorage for saved debug preference
    return localStorage.getItem('debugMode') === 'true';
  });

  const handleSetDebugMode = (enabled: boolean) => {
    setDebugMode(enabled);
    localStorage.setItem('debugMode', enabled.toString());
  };

  const debugLog = (...args: any[]) => {
    if (debugMode) {
      console.log('[DEBUG]', ...args);
    }
  };

  return (
    <DebugContext.Provider value={{ debugMode, setDebugMode: handleSetDebugMode, debugLog }}>
      {children}
    </DebugContext.Provider>
  );
}

export function useDebug() {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}