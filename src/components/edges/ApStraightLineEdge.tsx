import { BaseEdge, type EdgeProps } from '@xyflow/react'
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
      y={y - flowConstants.AP_NODE_SIZE.ADD_BUTTON.height / 2 + 5}
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
  targetY,
  data,
}: EdgeProps & Omit<ApStraightLineEdgeType, 'id' | 'source' | 'target' | 'type'>) => {
  const { openStepSelectorForStep } = useWorkflow()

  const lineStartX = sourceX
  const lineStartY = sourceY + flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE
  const lineLength = targetY - sourceY - 2 * flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE
  const path = `M ${lineStartX} ${lineStartY} v${lineLength} ${data.drawArrowHead ? flowConstants.ARROW_DOWN : ''}`

  const handleAddStep = () => {
    openStepSelectorForStep(data.parentStepName, {
      x: lineStartX,
      y: lineStartY + (targetY - sourceY) / 2,
    })
  }

  return (
    <>
      <BaseEdge
        path={path}
        style={{
          strokeWidth: `${flowConstants.LINE_WIDTH}px`,
        }}
      />

      {!data.hideAddButton && <AddButton x={lineStartX} y={lineStartY + lineLength / 2} onAddStep={handleAddStep} />}
    </>
  )
}
