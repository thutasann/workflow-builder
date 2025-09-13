import { BaseEdge, type EdgeProps } from '@xyflow/react'
import React from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import { flowConstants } from '../../utils/flowConstants'
import type { ApRouterEndEdge as ApRouterEndEdgeType } from '../../types/workflow.types'

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
      className="overflow-visible"
    >
      <button
        className="w-full h-full bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors text-sm font-bold shadow-sm"
        onClick={onAddStep}
      >
        +
      </button>
    </foreignObject>
  )
}

export const ApRouterEndEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) => {
  const { openStepSelectorForStep } = useWorkflow()
  const routerData = data as ApRouterEndEdgeType['data']
  
  const verticalLineLength =
    flowConstants.VERTICAL_SPACE_BETWEEN_STEPS -
    2 * flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE

  const horizontalLineLength =
    (Math.abs(targetX - sourceX) - 2 * flowConstants.ARC_LENGTH) *
    (targetX > sourceX ? 1 : -1)

  const distanceBetweenTargetAndSource = Math.abs(targetX - sourceX)

  const generatePath = () => {
    // Start point
    let path = `M ${sourceX - 0.5} ${
      sourceY - flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE * 2
    }`

    // Vertical line from start
    path += `v ${routerData.verticalSpaceBetweenLastNodeInBranchAndEndLine}`

    // Arc or vertical line based on distance
    if (distanceBetweenTargetAndSource >= flowConstants.ARC_LENGTH) {
      path +=
        targetX > sourceX
          ? flowConstants.ARC_RIGHT_DOWN
          : flowConstants.ARC_LEFT_DOWN
    } else {
      path += `v ${
        flowConstants.ARC_LENGTH +
        flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE +
        2
      }`
    }

    // Optional horizontal line
    if (routerData.drawHorizontalLine) {
      path += `h ${horizontalLineLength} ${
        targetX > sourceX ? flowConstants.ARC_RIGHT : flowConstants.ARC_LEFT
      }`
    }

    // Optional ending vertical line with arrow
    if (routerData.drawEndingVerticalLine) {
      path += `v${verticalLineLength}`
      if (!routerData.isNextStepEmpty) {
        path += flowConstants.ARROW_DOWN
      }
    }

    return path
  }

  const path = generatePath()
  
  const handleAddStep = () => {
    openStepSelectorForStep(routerData.routerOrBranchStepName, {
      x: targetX,
      y: targetY - verticalLineLength / 2,
    })
  }

  return (
    <>
      <BaseEdge
        path={path}
        style={{ 
          strokeWidth: `${flowConstants.LINE_WIDTH}px`
        }}
      />
      
      {routerData.drawEndingVerticalLine && (
        <AddButton
          x={targetX - flowConstants.LINE_WIDTH / 2}
          y={targetY - verticalLineLength + flowConstants.AP_NODE_SIZE.ADD_BUTTON.height}
          onAddStep={handleAddStep}
        />
      )}
    </>
  )
}