import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getStraightPath } from '@xyflow/react'
import React from 'react'
import { useWorkflow } from '../../context/WorkflowContext'

interface CustomBranchEdgeProps extends EdgeProps {
  data?: {
    branchLabel?: string
    branchId?: string
    branchIndex?: number
  }
  sourceHandle?: string | null
}

export const CustomBranchEdge: React.FC<CustomBranchEdgeProps> = ({
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
  sourceHandle,
}) => {
  const { openStepSelector } = useWorkflow()

  // Create a straight vertical path
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    openStepSelector(source, target, { x: e.clientX, y: e.clientY }, sourceHandle)
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: '#e5e7eb',
          strokeWidth: 2,
        }}
      />

      {/* Plus button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            className='edge-button'
            onClick={handlePlusClick}
            style={{
              width: '28px',
              height: '28px',
              background: '#9ca3af',
              border: '3px solid #f3f4f6',
              borderRadius: '6px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6b7280'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#9ca3af'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
