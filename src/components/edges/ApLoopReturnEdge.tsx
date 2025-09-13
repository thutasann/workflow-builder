import { BaseEdge, type EdgeProps } from '@xyflow/react'

import { useWorkflow } from '../../context/WorkflowContext'
import { flowConstants } from '../../utils/flowConstants'
import type { ApLoopReturnEdge as ApLoopReturnEdgeType } from '../../types/workflow.types'

export const ApLoopReturnEdge = ({ sourceX, sourceY, targetX, targetY, data, id }: EdgeProps) => {
  const loopData = data as ApLoopReturnEdgeType['data']
  const { openStepSelectorForStep } = useWorkflow()

  const horizontalLineLength = Math.abs(sourceX - targetX) - 2 * flowConstants.ARC_LENGTH

  const verticalLineLength = loopData.verticalSpaceBetweenReturnNodeStartAndEnd - flowConstants.ARC_LENGTH / 2

  const ARROW_RIGHT = ` m-5 -6 l6 6  m-6 0 m6 0 l-6 6 m3 -6`
  const endLineLength =
    flowConstants.VERTICAL_SPACE_BETWEEN_STEPS - 2 * flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE

  const path = `
  M ${sourceX - 0.5} ${sourceY - flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE * 2 - 1}
  v 1
  ${flowConstants.ARC_LEFT_DOWN} h -${horizontalLineLength}
  ${flowConstants.ARC_RIGHT_UP} v -${verticalLineLength}
  a15,15 0 0,1 15,-15
  
  h ${horizontalLineLength / 2 - 2 * flowConstants.ARC_LENGTH}
   ${ARROW_RIGHT}
 
  M ${sourceX - flowConstants.ARC_LENGTH - horizontalLineLength / 2} ${
    sourceY + flowConstants.VERTICAL_SPACE_BETWEEN_STEP_AND_LINE + flowConstants.ARC_LENGTH / 2
  }
   v${endLineLength} ${loopData.drawArrowHeadAfterEnd ? flowConstants.ARROW_DOWN : ''} 
   `

  const buttonPosition = {
    x: sourceX - horizontalLineLength / 2 - flowConstants.ARC_LENGTH - flowConstants.AP_NODE_SIZE.ADD_BUTTON.width / 2,
    y: sourceY + endLineLength / 2,
  }

  const handleAddStep = () => {
    openStepSelectorForStep(loopData.parentStepName, {
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

      <foreignObject
        x={buttonPosition.x}
        y={buttonPosition.y}
        width={flowConstants.AP_NODE_SIZE.ADD_BUTTON.width}
        height={flowConstants.AP_NODE_SIZE.ADD_BUTTON.height}
        className='overflow-visible'
      >
        <button
          className='w-full h-full bg-white border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors text-sm font-bold shadow-sm'
          onClick={handleAddStep}
        >
          +
        </button>
      </foreignObject>
    </>
  )
}
