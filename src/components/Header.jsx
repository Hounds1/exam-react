import React from 'react'

function Header() {
  return (
    <header className="app-header">
      <div className="brand">MyReactApp</div>
      <nav className="nav">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#about">About</a>
      </nav>
    </header>
  )
}

export default Header

