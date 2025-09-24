import React from 'react'

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-section">
        <h3>Navigation</h3>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#reports">Reports</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </div>
      <div className="sidebar-section">
        <h3>Shortcuts</h3>
        <ul>
          <li><a href="#create">Create</a></li>
          <li><a href="#import">Import</a></li>
          <li><a href="#export">Export</a></li>
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar

