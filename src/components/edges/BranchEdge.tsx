import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getStraightPath } from '@xyflow/react'
import React from 'react'
import { useWorkflow } from '../../context/WorkflowContext'

interface BranchEdgeProps extends EdgeProps {
  data?: {
    branchLabel?: string
    branchId?: string
    branchIndex?: number
  }
  sourceHandle?: string | null
}

export const BranchEdge: React.FC<BranchEdgeProps> = ({
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

  // Different colors for different branches
  const branchColors = ['#ef4444', '#3b82f6', '#10b981']
  const strokeColor = data?.branchIndex !== undefined ? branchColors[data.branchIndex] : '#9ca3af'

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ stroke: strokeColor, strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          {data?.branchLabel && (
            <div
              style={{
                background: '#ffffff',
                border: `1px solid ${strokeColor}`,
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '12px',
                color: strokeColor,
                marginBottom: '8px',
                fontWeight: '500',
              }}
            >
              {data.branchLabel}
            </div>
          )}
          <button
            className='edge-button'
            onClick={handlePlusClick}
            style={{
              width: '28px',
              height: '28px',
              background: strokeColor,
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
              e.currentTarget.style.opacity = '0.8'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
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