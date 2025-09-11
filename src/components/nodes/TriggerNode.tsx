import React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { CustomNodeProps } from '../../types/workflow.types'

export const TriggerNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`trigger-node ${selected ? 'selected' : ''}`}
      style={{
        background: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px 20px',
        minWidth: '350px',
        boxShadow: selected ? '0 0 0 2px #6366f1' : '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {data.integrationLogo && (
          <img
            src={data.integrationLogo}
            alt={data.integrationName}
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: '16px',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>1.</span>
            <span>{data.label}</span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{data.integrationName}</div>
        </div>
      </div>

      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          bottom: '-6px',
        }}
      />
    </div>
  )
}
