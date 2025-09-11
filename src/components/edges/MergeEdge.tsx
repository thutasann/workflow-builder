import { BaseEdge, type EdgeProps } from '@xyflow/react'
import React from 'react'

interface MergeEdgeProps extends EdgeProps {
  data?: {
    branchId?: string
  }
  targetHandle?: string | null
}

export const MergeEdge: React.FC<MergeEdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  targetHandle,
}) => {
  // Create a step path that goes down then across
  const midY = sourceY + (targetY - sourceY) * 0.75;
  
  // Use getStraightPath for a cleaner connection
  const path = `
    M${sourceX},${sourceY}
    L${sourceX},${midY}
    L${targetX},${midY}
    L${targetX},${targetY}
  `;

  return (
    <BaseEdge 
      path={path} 
      markerEnd={markerEnd} 
      style={{ 
        stroke: '#e5e7eb', 
        strokeWidth: 2,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
    />
  )
}