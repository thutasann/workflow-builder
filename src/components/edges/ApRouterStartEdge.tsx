import { BaseEdge, type EdgeProps } from '@xyflow/react'
import React from 'react'

import { flowConstants } from '../../utils/flowConstants'
import type { ApRouterStartEdge as ApRouterStartEdgeType } from '../../types/workflow.types'
import { StepLocationRelativeToParent } from '../../types/workflow.types'

interface BranchLabelProps {
  label: string
  sourceNodeName: string
  targetNodeName: string
  stepLocationRelativeToParent: StepLocationRelativeToParent
  branchIndex: number
}

const BranchLabel: React.FC<BranchLabelProps> = ({ label }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div
        className="bg-background"
        style={{
          paddingTop: flowConstants.LABEL_VERTICAL_PADDING / 2 + 'px',
          paddingBottom: flowConstants.LABEL_VERTICAL_PADDING / 2 + 'px',
        }}
      >
        <div
          className="flex items-center justify-center gap-0.5 select-none transition-all rounded-full text-sm border border-solid bg-primary-100/30 dark:bg-primary-100/15 border-primary/50 px-2 text-primary/80 dark:text-primary/90 hover:text-primary hover:border-primary"
          style={{
            height: flowConstants.LABEL_HEIGHT + 'px',
            maxWidth: flowConstants.AP_NODE_SIZE.step.width - 10 + 'px',
          }}
        >
          <div className="truncate">
            {label === 'Otherwise' ? 'Otherwise' : label}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ApRouterStartEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  source,
  target,
  id,
}: EdgeProps) => {
  // Type cast the data to our expected shape
  const routerData = data as ApRouterStartEdgeType['data']
  
  const verticalLineLength =
    flowConstants.VERTICAL_SPACE_BETWEEN_STEPS -
    flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE +
    flowConstants.LABEL_HEIGHT

  const distanceBetweenSourceAndTarget = Math.abs(targetX - sourceX)
  
  const generatePath = () => {
    // Start point and initial vertical line
    let path = `M ${targetX} ${targetY - flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE}`

    // Add arrow if branch is not empty
    if (!routerData.isBranchEmpty) {
      path += flowConstants.ARROW_DOWN
    }

    // Vertical line up
    path += `v -${verticalLineLength}`

    // Arc or vertical line based on distance
    if (distanceBetweenSourceAndTarget >= flowConstants.ARC_LENGTH) {
      // Add appropriate arc based on source position
      path += sourceX > targetX ? ' a12,12 0 0,1 12,-12' : ' a-12,-12 0 0,0 -12,-12'

      if (routerData.drawHorizontalLine) {
        // Calculate horizontal line length
        const horizontalLength =
          (Math.abs(targetX - sourceX) + 3 - 2 * flowConstants.ARC_LENGTH) *
          (sourceX > targetX ? 1 : -1)

        // Add horizontal line and arc
        path += `h ${horizontalLength}`
        path += sourceX > targetX ? flowConstants.ARC_LEFT_UP : flowConstants.ARC_RIGHT_UP
      }

      if (routerData.drawStartingVerticalLine) {
        // Add final vertical line
        const finalVerticalLength =
          flowConstants.VERTICAL_SPACE_BETWEEN_STEPS / 2 -
          2 * flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE
        path += `v -${finalVerticalLength}`
      }
    } else {
      // If distance is small, just draw vertical line
      path += `v -${flowConstants.ARC_LENGTH + flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE}`
    }

    return path
  }

  const path = generatePath()

  return (
    <>
      <BaseEdge
        path={path}
        style={{ 
          strokeWidth: `${flowConstants.LINE_WIDTH}px`
        }}
      />

      <foreignObject
        width={flowConstants.AP_NODE_SIZE.step.width - 10 + 'px'}
        height={
          flowConstants.LABEL_HEIGHT +
          flowConstants.LABEL_VERTICAL_PADDING +
          'px'
        }
        x={targetX - (flowConstants.AP_NODE_SIZE.step.width - 10) / 2}
        y={
          targetY -
          verticalLineLength / 2 -
          flowConstants.AP_NODE_SIZE.ADD_BUTTON.height -
          40
        }
        className="flex items-center"
      >
        <BranchLabel
          label={routerData.label}
          sourceNodeName={source}
          targetNodeName={target}
          stepLocationRelativeToParent={routerData.stepLocationRelativeToParent}
          branchIndex={routerData.branchIndex}
        />
      </foreignObject>
    </>
  )
}