import React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { CustomNodeProps } from '../../types/workflow.types'

export const RouterNode: React.FC<CustomNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`router-node ${selected ? 'selected' : ''}`}
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
      <Handle
        type='target'
        position={Position.Top}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          top: '-6px',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🔀</span>
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
            <span>{data.stepNumber}.</span>
            <span>Router</span>
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Route to multiple branches</div>
        </div>
      </div>

      {/* Multiple bottom handles for branches */}
      <Handle
        id='branch-1'
        type='source'
        position={Position.Bottom}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          bottom: '-6px',
          left: '20%',
        }}
      />
      <Handle
        id='branch-2'
        type='source'
        position={Position.Bottom}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          bottom: '-6px',
          left: '40%',
        }}
      />
      <Handle
        id='branch-3'
        type='source'
        position={Position.Bottom}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          bottom: '-6px',
          left: '60%',
        }}
      />
      <Handle
        id='branch-4'
        type='source'
        position={Position.Bottom}
        style={{
          width: '10px',
          height: '10px',
          background: '#9ca3af',
          border: '2px solid #fff',
          bottom: '-6px',
          left: '80%',
        }}
      />
    </div>
  )
}
