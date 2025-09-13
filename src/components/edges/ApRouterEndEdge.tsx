import { BaseEdge, type EdgeProps } from '@xyflow/react'

import { flowConstants } from '../../utils/flowConstants'
import type { ApRouterEndEdge as ApRouterEndEdgeType } from '../../types/workflow.types'

export const ApRouterEndEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: EdgeProps) => {
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

  return (
    <BaseEdge
      path={path}
      style={{ 
        strokeWidth: `${flowConstants.LINE_WIDTH}px`,
      }}
    />
  )
}