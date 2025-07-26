import './App.css'
import { ConnectionStatus } from './components/ConnectionStatus'
import { LoginForm } from './components/LoginForm'
import { ApiKeyForm } from './components/ApiKeyForm'
import { AzureADForm } from './components/AzureADForm'
import { AuthSelector } from './components/AuthSelector'
import { AuthenticatedView } from './components/AuthenticatedView'
import { useAuth } from './hooks/useAuth'

function App(): React.JSX.Element {
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

export default App
