import { createContext, useContext, useState, type ReactNode } from 'react';

interface DebugContextType {
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  debugLog: (...args: unknown[]) => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export function DebugProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [debugMode, setDebugMode] = useState(() => {
    // Check localStorage for saved debug preference
    return localStorage.getItem('debugMode') === 'true';
  });

  const handleSetDebugMode = (enabled: boolean): void => {
    setDebugMode(enabled);
    localStorage.setItem('debugMode', enabled.toString());
  };

  const debugLog = (...args: unknown[]): void => {
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

export function useDebug(): DebugContextType {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}