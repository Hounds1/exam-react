import React from 'react'

function Card({ title, children, footer }) {
  return (
    <div className="card">
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">
        {children}
      </div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

export default Card

