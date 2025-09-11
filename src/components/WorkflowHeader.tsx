import React from 'react'

export const WorkflowHeader: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        background: '#f3f4f6',
        borderRadius: '20px',
        padding: '8px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 500,
        }}
      >
        <span>Test Flow</span>
        <span>⌘</span>
        <span>+</span>
        <span>D</span>
      </div>
    </div>
  )
}
