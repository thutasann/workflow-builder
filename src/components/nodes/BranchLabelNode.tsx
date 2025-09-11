import React from 'react'
import type { NodeProps } from '@xyflow/react'

export const BranchLabelNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div
      style={{
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        padding: '4px 12px',
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: '500',
        whiteSpace: 'nowrap',
      }}
    >
      {data.label as string}
    </div>
  )
}
