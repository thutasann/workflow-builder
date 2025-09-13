import { BaseEdge, type EdgeProps } from '@xyflow/react'
import React from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import { flowConstants } from '../../utils/flowConstants'
import type { ApLoopStartEdge as ApLoopStartEdgeType } from '../../types/workflow.types'

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

export const ApLoopStartEdge = ({ sourceX, sourceY, targetX, targetY, data, source, id }: EdgeProps) => {
  const { openStepSelectorForStep } = useWorkflow()
  const loopData = data as ApLoopStartEdgeType['data']

  const startY = sourceY + flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE
  const verticalLineLength =
    flowConstants.VERTICAL_SPACE_BETWEEN_STEPS - 2 * flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE

  const horizontalLineLength = Math.abs(targetX - sourceX) - 2 * flowConstants.ARC_LENGTH

  const path = `M ${sourceX} ${startY} v${verticalLineLength / 2}
  ${flowConstants.ARC_RIGHT_DOWN} h${horizontalLineLength}
  ${flowConstants.ARC_RIGHT} v${verticalLineLength}
   ${!loopData.isLoopEmpty ? flowConstants.ARROW_DOWN : ''}`

  const buttonPosition = {
    x: sourceX - flowConstants.AP_NODE_SIZE.ADD_BUTTON.width / 2 + horizontalLineLength + flowConstants.ARC_LENGTH * 2,
    y: startY + verticalLineLength + flowConstants.ARC_LENGTH,
  }

  const handleAddStep = () => {
    openStepSelectorForStep(source, {
      x: buttonPosition.x + flowConstants.AP_NODE_SIZE.ADD_BUTTON.width / 2,
      y: buttonPosition.y + flowConstants.AP_NODE_SIZE.ADD_BUTTON.height / 2,
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

      {!loopData.isLoopEmpty && (
        <AddButton
          x={buttonPosition.x + flowConstants.AP_NODE_SIZE.ADD_BUTTON.width / 2}
          y={buttonPosition.y + flowConstants.AP_NODE_SIZE.ADD_BUTTON.height / 2}
          onAddStep={handleAddStep}
        />
      )}
    </>
  )
}
