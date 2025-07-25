import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { ConnectionStatus } from './components/ConnectionStatus'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>USAsset Portal</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Welcome to the USAsset Portal - Connected to API Service
        </p>
      </div>
      <p className="read-the-docs">
        API Status indicator in bottom right corner
      </p>
      <ConnectionStatus />
    </>
  )
}

export default App
