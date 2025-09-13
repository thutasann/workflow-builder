import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Plus } from 'lucide-react'
import React from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import { flowConstants } from '../../utils/flowConstants'
import type { ApBigAddButtonNode as ApBigAddButtonNodeType } from '../../types/workflow.types'

export const ApBigAddButtonNode = React.memo(({ data, id, positionAbsoluteX, positionAbsoluteY }: NodeProps & Omit<ApBigAddButtonNodeType, 'position'>) => {
  const { openStepSelectorForStep } = useWorkflow()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Open step selector at the button position
    openStepSelectorForStep(
      data.parentStepName, 
      {
        x: positionAbsoluteX + flowConstants.AP_NODE_SIZE.bigAddButton.width / 2,
        y: positionAbsoluteY + flowConstants.AP_NODE_SIZE.bigAddButton.height / 2,
      },
      data.branchIndex
    )
  }

  return (
    <div
      style={{
        width: `${flowConstants.AP_NODE_SIZE.bigAddButton.width}px`,
        height: `${flowConstants.AP_NODE_SIZE.bigAddButton.height}px`,
      }}
      className='group relative'
    >
      <button
        onClick={handleClick}
        className='w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm group-hover:shadow-md'
      >
        <Plus className='w-6 h-6' />
      </button>
      
      {/* React Flow handles */}
      <Handle type='source' style={flowConstants.HANDLE_STYLING} position={Position.Bottom} />
      <Handle type='target' style={flowConstants.HANDLE_STYLING} position={Position.Top} />
    </div>
  )
})

ApBigAddButtonNode.displayName = 'ApBigAddButtonNode'
