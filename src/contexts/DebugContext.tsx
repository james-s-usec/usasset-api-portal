import { useState, type ReactNode } from 'react';
import { DebugContext } from './DebugContextValue';

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