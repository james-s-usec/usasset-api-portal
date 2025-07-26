import { useContext } from 'react';
import { DebugContext, type DebugContextType } from '../contexts/DebugContextValue';

export function useDebug(): DebugContextType {
  const context = useContext(DebugContext);
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}