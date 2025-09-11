import { type NodeProps } from '@xyflow/react'
import { Plus } from 'lucide-react'
import React from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import { flowConstants } from '../../utils/flowConstants'
import type { ApBigAddButtonNode as ApBigAddButtonNodeType } from '../../types/workflow.types'
import { FlowActionType, StepLocationRelativeToParent } from '../../types/workflow.types'

export const ApBigAddButtonNode = React.memo(
  ({ data }: NodeProps & Omit<ApBigAddButtonNodeType, 'position'>) => {
    const { addAction } = useWorkflow()
    
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // For now, create a simple action step
      // Later this should open the step selector
      const newAction = {
        name: `step-${Date.now()}`,
        displayName: 'New Step',
        type: FlowActionType.PIECE,
        settings: {},
      }
      
      if (data.stepLocationRelativeToParent === StepLocationRelativeToParent.INSIDE_BRANCH) {
        // Handle branch-specific logic
        console.log('Adding step to branch:', data.branchIndex)
      } else {
        // Add to main flow
        addAction(data.parentStepName, newAction)
      }
      
      // Alternative: Open step selector
      // openStepSelector(
      //   data.parentStepName,
      //   'temp-target',
      //   { x: 0, y: 0 }
      // )
    }
    
    return (
      <div
        style={{
          width: `${flowConstants.AP_NODE_SIZE.bigAddButton.width}px`,
          height: `${flowConstants.AP_NODE_SIZE.bigAddButton.height}px`,
        }}
        className="group"
      >
        <button
          onClick={handleClick}
          className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm group-hover:shadow-md"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    )
  }
)

ApBigAddButtonNode.displayName = 'ApBigAddButtonNode'