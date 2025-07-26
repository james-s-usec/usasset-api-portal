import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConnectionStatus } from './components/ConnectionStatus'
import { LoginForm } from './components/LoginForm'
import { ApiKeyForm } from './components/ApiKeyForm'
import { AzureADForm } from './components/AzureADForm'
import { AzureADCallback } from './components/AzureADCallback'
import { AuthSelector } from './components/AuthSelector'
import { AuthenticatedView } from './components/AuthenticatedView'
import { useAuth } from './hooks/useAuth'

function AppContent(): React.JSX.Element {
  const {
    isAuthenticated,
    user,
    loading,
    authMethod,
    loginMode,
    setLoginMode,
    handleLoginSuccess,
    handleApiKeySuccess,
    handleLogout,
  } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthSelector loginMode={loginMode} onModeChange={setLoginMode} />
        {loginMode === 'apikey' ? (
          <ApiKeyForm onApiKeySuccess={handleApiKeySuccess} />
        ) : loginMode === 'jwt' ? (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <AzureADForm onLoginSuccess={handleLoginSuccess} />
        )}
        <ConnectionStatus />
      </>
    )
  }

  return (
    <>
      <AuthenticatedView 
        user={user} 
        authMethod={authMethod} 
        onLogout={handleLogout} 
      />
      <ConnectionStatus />
    </>
  )
}

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/auth/callback" element={
          <AzureADCallbackWrapper />
        } />
      </Routes>
    </BrowserRouter>
  )
}

// Wrapper component to handle the callback with auth context
function AzureADCallbackWrapper(): React.JSX.Element {
  const { handleLoginSuccess } = useAuth()
  return <AzureADCallback onLoginSuccess={handleLoginSuccess} />
}

export default App
