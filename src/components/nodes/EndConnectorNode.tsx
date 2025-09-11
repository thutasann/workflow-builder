import React from 'react'
import { Handle, Position } from '@xyflow/react'
import type { CustomNodeProps } from '../../types/workflow.types'

export const EndConnectorNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        width: '100px',
        height: '40px',
        background: '#ffffff',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        position: 'relative',
      }}
    >
      {/* Multiple input handles for branches - invisible */}
      <Handle
        type="target"
        position={Position.Top}
        id="branch-1"
        style={{
          background: 'transparent',
          width: '8px',
          height: '8px',
          border: 'none',
          left: '15%',
          top: '-4px',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="branch-2"
        style={{
          background: 'transparent',
          width: '8px',
          height: '8px',
          border: 'none',
          left: '35%',
          top: '-4px',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="branch-3"
        style={{
          background: 'transparent',
          width: '8px',
          height: '8px',
          border: 'none',
          left: '65%',
          top: '-4px',
        }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="branch-4"
        style={{
          background: 'transparent',
          width: '8px',
          height: '8px',
          border: 'none',
          left: '85%',
          top: '-4px',
        }}
      />
      
      {/* End text */}
      <span style={{
        fontSize: '14px',
        fontWeight: '500',
        color: '#6b7280',
      }}>
        End
      </span>
      
      {/* Single output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: '#9ca3af',
          width: '8px',
          height: '8px',
          border: '2px solid #fff',
        }}
      />
    </div>
  )
}