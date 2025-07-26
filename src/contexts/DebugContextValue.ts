import { createContext } from 'react';

export interface DebugContextType {
  debugMode: boolean;
  setDebugMode: (enabled: boolean) => void;
  debugLog: (...args: unknown[]) => void;
}

export const DebugContext = createContext<DebugContextType | undefined>(undefined);