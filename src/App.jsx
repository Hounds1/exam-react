import { useState } from 'react'
import './App.css'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Card from './components/Card.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <Header />
      <div className="app-content">
        <Sidebar />
        <main className="app-main">
          <section id="dashboard">
            <h1>Dashboard</h1>
            <div className="card-grid">
              <Card title="Welcome">
                <p>This is a starter layout built with React + Vite.</p>
              </Card>
              <Card title="Counter" footer={<span>Clicks: {count}</span>}>
                <button onClick={() => setCount((prev) => prev + 1)}>Increase</button>
              </Card>
              <Card title="Info">
                <p>Edit <code>src/App.jsx</code> to customize.</p>
              </Card>
            </div>
          </section>

          <section id="reports">
            <h2>Reports</h2>
            <div className="card-grid">
              <Card title="Sales">
                <p>Example content...</p>
              </Card>
              <Card title="Traffic">
                <p>Example content...</p>
              </Card>
            </div>
          </section>

          <section id="settings">
            <h2>Settings</h2>
            <Card>
              <form className="settings-form">
                <label>
                  Name
                  <input type="text" placeholder="Your name" />
                </label>
                <label>
                  Email
                  <input type="email" placeholder="you@example.com" />
                </label>
                <button type="button">Save</button>
              </form>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
