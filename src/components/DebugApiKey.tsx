import { useState, useEffect, useCallback } from 'react';
import { authStorage } from '../utils/auth-storage';
import { useAuth } from '../hooks/useAuth';
import { useDebug } from '../hooks/useDebug';

export function DebugApiKey(): React.JSX.Element {
  const { debugMode, setDebugMode } = useDebug();
  const [apiKey, setApiKeyInput] = useState('test-key-123');
  const [storageInfo, setStorageInfo] = useState<{
    apiKey: string | null;
    authToken: string | null;
    authState: {
      isAuthenticated: boolean;
      authMethod: string;
      user: unknown;
    };
    timestamp: string;
  }>({
    apiKey: null,
    authToken: null,
    authState: {
      isAuthenticated: false,
      authMethod: 'none',
      user: null
    },
    timestamp: new Date().toISOString()
  });
  const [flowStep, setFlowStep] = useState(0);
  const [flowResults, setFlowResults] = useState<string[]>([]);
  
  const auth = useAuth();

  const updateStorageInfo = useCallback((): void => {
    setStorageInfo({
      apiKey: authStorage.getApiKey(),
      authToken: authStorage.getToken(),
      authState: {
        isAuthenticated: auth.isAuthenticated,
        authMethod: auth.authMethod,
        user: auth.user
      },
      timestamp: new Date().toISOString()
    });
  }, [auth.isAuthenticated, auth.authMethod, auth.user]);

  useEffect(() => {
    updateStorageInfo();
  }, [updateStorageInfo]);

  const addResult = (message: string): void => {
    setFlowResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const runCompleteFlow = async (): Promise<void> => {
    setFlowResults([]);
    setFlowStep(1);
    
    // Step 1: Clear everything
    addResult('Step 1: Clearing all auth...');
    authStorage.clearAll();
    await new Promise(r => setTimeout(r, 100));
    
    // Step 2: Set API key using auth storage
    setFlowStep(2);
    addResult(`Step 2: Setting API key: ${apiKey}`);
    authStorage.setApiKey(apiKey);
    addResult(`Step 2 Result: sessionStorage.apiKey = ${authStorage.getApiKey()}`);
    await new Promise(r => setTimeout(r, 100));
    
    // Step 3: Call handleApiKeySuccess
    setFlowStep(3);
    addResult('Step 3: Calling handleApiKeySuccess...');
    auth.handleApiKeySuccess(apiKey);
    await new Promise(r => setTimeout(r, 100));
    
    // Step 4: Check final state
    setFlowStep(4);
    addResult('Step 4: Checking final state...');
    updateStorageInfo();
    addResult(`Step 4 Result: isAuthenticated = ${auth.isAuthenticated}`);
    addResult(`Step 4 Result: authMethod = ${auth.authMethod}`);
    
    setFlowStep(5);
    addResult('Flow complete!');
  };

  const handleTestRequest = async (): Promise<void> => {
    addResult('Testing API request...');
    const apiKeyFromStorage = authStorage.getApiKey();
    addResult(`Using API key from storage: ${apiKeyFromStorage}`);
    
    try {
      const response = await fetch('http://localhost:3009/v1/health', {
        headers: {
          'x-api-key': apiKeyFromStorage || ''
        }
      });
      addResult(`Response: ${response.status} ${response.statusText}`);
    } catch (error) {
      addResult(`Request failed: ${error}`);
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    background: 'white',
    border: '2px solid #333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 9999,
    maxWidth: '500px',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  const buttonStyle: React.CSSProperties = {
    margin: '5px',
    padding: '8px 16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px'
  };

  const stepStyle = (step: number): React.CSSProperties => ({
    padding: '10px',
    margin: '5px 0',
    backgroundColor: flowStep === step ? '#e3f2fd' : '#f5f5f5',
    borderLeft: flowStep === step ? '4px solid #2196f3' : '4px solid transparent',
    borderRadius: '4px'
  });

  // Only show debug tool when debug mode is enabled
  if (!debugMode) {
    return (
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
        <button 
          onClick={() => setDebugMode(true)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#6c757d', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Enable Debug Mode
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>API Key Debug Tool</h3>
        <button 
          onClick={() => setDebugMode(false)}
          style={{ 
            padding: '4px 8px', 
            backgroundColor: '#dc3545', 
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ✕ Close Debug
        </button>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKeyInput(e.target.value)}
          style={{ width: '100%', padding: '5px' }}
          placeholder="Enter API key"
        />
      </div>

      <div>
        <button onClick={runCompleteFlow} style={{...buttonStyle, backgroundColor: '#28a745'}}>
          Run Complete Flow
        </button>
        <button onClick={handleTestRequest} style={buttonStyle}>
          Test API Request
        </button>
        <button onClick={() => { authStorage.clearAll(); updateStorageInfo(); setFlowResults([]); }} style={{...buttonStyle, backgroundColor: '#dc3545'}}>
          Clear All
        </button>
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>Flow Steps:</h4>
        <div style={stepStyle(1)}>Step 1: Clear existing auth</div>
        <div style={stepStyle(2)}>Step 2: Set API key in sessionStorage</div>
        <div style={stepStyle(3)}>Step 3: Call handleApiKeySuccess</div>
        <div style={stepStyle(4)}>Step 4: Check final state</div>
        <div style={stepStyle(5)}>Step 5: Complete!</div>
      </div>

      <div style={{ marginTop: '15px', fontSize: '12px', fontFamily: 'monospace' }}>
        <strong>Current State:</strong>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '11px' }}>
          {JSON.stringify(storageInfo, null, 2)}
        </pre>
      </div>

      {flowResults.length > 0 && (
        <div style={{ marginTop: '15px', fontSize: '12px', fontFamily: 'monospace' }}>
          <strong>Flow Results:</strong>
          <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
            {flowResults.map((result, i) => (
              <div key={i}>{result}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}