import React from 'react'
import type { WorkflowNode } from '../types/workflow.types'

interface BranchLabelsProps {
  routerNode: WorkflowNode
  branchPositions: number[]
}

export const BranchLabels: React.FC<BranchLabelsProps> = ({ routerNode, branchPositions }) => {
  const labels = ['Add Customer to Sheet', 'Notify Me on Slack', 'Send Email to Customer', 'Otherwise']

  const labelY = routerNode.position.y + 80 // Position below router

  return (
    <>
      {branchPositions.slice(0, 3).map((x, index) => (
        <div
          key={`branch-label-${routerNode.id}-${index}`}
          style={{
            position: 'absolute',
            left: x,
            top: labelY,
            transform: 'translateX(-50%)',
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '4px 12px',
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {labels[index]}
        </div>
      ))}

      {/* Otherwise label positioned differently */}
      {branchPositions.length > 3 && (
        <div
          style={{
            position: 'absolute',
            left: branchPositions[3],
            top: labelY,
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#6b7280',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          {labels[3]}
        </div>
      )}
    </>
  )
}
