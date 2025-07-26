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
import { ToastContainer, useToast } from './components/Toast'
import { Dashboard } from './pages/Dashboard'

function App(): React.JSX.Element {
  const { toasts, showToast, dismissToast } = useToast()
  
  return (
    <BrowserRouter>
      <ToastContainer messages={toasts} onDismiss={dismissToast} />
      <Routes>
        <Route path="/" element={<AppContent showToast={showToast} />} />
        <Route path="/dashboard" element={<DashboardWrapper showToast={showToast} />} />
        <Route path="/auth/callback" element={
          <AzureADCallbackWrapper showToast={showToast} />
        } />
      </Routes>
    </BrowserRouter>
  )
}

// Update AppContent to receive showToast
function AppContent({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }): React.JSX.Element {
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
  
  // Wrap handleLoginSuccess to show toast
  const handleLoginSuccessWithToast = async (token: string) => {
    await handleLoginSuccess(token)
    showToast('Successfully logged in!', 'success')
  }
  
  // Wrap handleApiKeySuccess to show toast
  const handleApiKeySuccessWithToast = (apiKey: string) => {
    handleApiKeySuccess(apiKey)
    showToast('API key authenticated!', 'success')
  }
  
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <>
        <AuthSelector loginMode={loginMode} onModeChange={setLoginMode} />
        {loginMode === 'apikey' ? (
          <ApiKeyForm onApiKeySuccess={handleApiKeySuccessWithToast} />
        ) : loginMode === 'jwt' ? (
          <LoginForm onLoginSuccess={handleLoginSuccessWithToast} />
        ) : (
          <AzureADForm onLoginSuccess={handleLoginSuccessWithToast} />
        )}
        <ConnectionStatus />
      </>
    )
  }

  // Redirect to dashboard when authenticated
  return <Navigate to="/dashboard" replace />
}

// Wrapper component to handle the callback with auth context
function AzureADCallbackWrapper({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }): React.JSX.Element {
  const { handleLoginSuccess } = useAuth()
  
  const handleLoginSuccessWithToast = async (token: string) => {
    await handleLoginSuccess(token)
    showToast('Successfully logged in with Azure AD!', 'success')
  }
  
  return <AzureADCallback onLoginSuccess={handleLoginSuccessWithToast} />
}

// Dashboard wrapper with auth check
function DashboardWrapper({ showToast }: { showToast: (message: string, type: 'success' | 'error' | 'info') => void }): React.JSX.Element {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return (
    <>
      <Dashboard />
      <ConnectionStatus />
    </>
  )
}

export default App
