import React from 'react'
import { useReactFlow } from '@xyflow/react'
import type { WorkflowNode } from '../types/workflow.types'
import { calculateBranchPositions } from '../utils/layoutUtils'

export const BranchLabelsOverlay: React.FC = () => {
  const { getNodes } = useReactFlow()
  const nodes = getNodes() as WorkflowNode[]
  
  // Find all router nodes
  const routerNodes = nodes.filter(node => node.type === 'router')
  
  const labels = [
    'Add Customer to Sheet',
    'Notify Me on Slack', 
    'Send Email to Customer',
  ]
  
  return (
    <>
      {routerNodes.map(routerNode => {
        const branchPositions = calculateBranchPositions(routerNode.position.x, 4)
        const labelY = routerNode.position.y + 60 // Closer to router
        
        return (
          <React.Fragment key={`labels-${routerNode.id}`}>
            {/* Regular branch labels */}
            {branchPositions.slice(0, 3).map((x, index) => (
              <div
                key={`branch-label-${routerNode.id}-${index}`}
                className="react-flow__node"
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
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                {labels[index]}
              </div>
            ))}
            
            {/* Otherwise label */}
            <div
              className="react-flow__node"
              style={{
                position: 'absolute',
                left: branchPositions[3],
                top: labelY,
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            >
              Otherwise
            </div>
          </React.Fragment>
        )
      })}
    </>
  )
}