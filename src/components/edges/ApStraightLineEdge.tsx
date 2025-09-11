import { BaseEdge, getStraightPath, type EdgeProps } from '@xyflow/react'
import React from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import type { ApStraightLineEdge as ApStraightLineEdgeType } from '../../types/workflow.types'
import { flowConstants } from '../../utils/flowConstants'

interface AddButtonProps {
  x: number
  y: number
  onAddStep: () => void
}

const AddButton: React.FC<AddButtonProps> = ({ x, y, onAddStep }) => {
  return (
    <foreignObject
      x={x - flowConstants.AP_NODE_SIZE.ADD_BUTTON.width / 2}
      y={y - flowConstants.AP_NODE_SIZE.ADD_BUTTON.height / 2}
      width={flowConstants.AP_NODE_SIZE.ADD_BUTTON.width}
      height={flowConstants.AP_NODE_SIZE.ADD_BUTTON.height}
      className='overflow-visible'
    >
      <button
        className='w-full h-full bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors text-sm font-bold shadow-sm'
        onClick={onAddStep}
      >
        +
      </button>
    </foreignObject>
  )
}

export const ApStraightLineEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps & Omit<ApStraightLineEdgeType, 'id' | 'source' | 'target' | 'type'>) => {
  const { openStepSelectorForStep } = useWorkflow()

  // Use React Flow's getStraightPath for proper straight line rendering
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  // Calculate middle point for add button
  const midX = sourceX + (targetX - sourceX) / 2
  const midY = sourceY + (targetY - sourceY) / 2

  const handleAddStep = () => {
    // Open step selector popup at the button location
    openStepSelectorForStep(data.parentStepName, {
      x: midX,
      y: midY,
    })
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          strokeWidth: `${flowConstants.LINE_WIDTH}px`,
          stroke: '#6b7280',
        }}
      />

      {/* Add button in the middle of the edge (if not hidden) */}
      {!data.hideAddButton && <AddButton x={midX} y={midY} onAddStep={handleAddStep} />}
    </>
  )
}
