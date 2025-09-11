import { Handle, Position, type NodeProps } from '@xyflow/react'
import { ChevronDown } from 'lucide-react'
import React, { useMemo } from 'react'

import { useWorkflow } from '../../context/WorkflowContext'
import { cn } from '../../lib/utils'
import type { ApStepNode as ApStepNodeType } from '../../types/workflow.types'
import { FlowTriggerType } from '../../types/workflow.types'
import { flowConstants } from '../../utils/flowConstants'

// Helper function to check if step is trigger
const isTrigger = (stepType: string) => {
  return Object.values(FlowTriggerType).includes(stepType as FlowTriggerType)
}

export const ApStepNode = React.memo(({ data: { step } }: NodeProps & Omit<ApStepNodeType, 'position'>) => {
  const { selectedStep, selectStep, flowVersion } = useWorkflow()

  const isSelected = selectedStep === step.name
  const isTriggerStep = isTrigger(step.type)

  // Calculate step index for numbering
  const stepIndex = useMemo(() => {
    // For now, just return 1 for trigger, will implement proper counting later
    return isTriggerStep ? 1 : 2
  }, [step, flowVersion, isTriggerStep])

  const handleStepClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    selectStep(step.name)
    e.preventDefault()
    e.stopPropagation()
  }

  // Get step icon and display info
  const getStepIcon = () => {
    if (isTriggerStep) {
      return '⚡' // Lightning bolt for trigger
    }
    return '🔧' // Tool for actions
  }

  const getStepColor = () => {
    if (isTriggerStep) return 'border-blue-500'
    return 'border-gray-300'
  }

  return (
    <div
      style={{
        height: `${flowConstants.AP_NODE_SIZE.step.height}px`,
        width: `${flowConstants.AP_NODE_SIZE.step.width}px`,
        maxWidth: `${flowConstants.AP_NODE_SIZE.step.width}px`,
      }}
      className={cn(
        'transition-all border-box rounded-sm border border-solid relative hover:border-primary/70 group bg-white',
        {
          'border-primary/70': isSelected,
          'shadow-sm': true,
        },
        getStepColor(),
      )}
      onClick={handleStepClick}
    >
      {/* Step name tooltip */}
      <div
        className='absolute left-full pl-3 text-accent-foreground text-sm opacity-0 transition-all duration-300 group-hover:opacity-100'
        style={{
          top: `${flowConstants.AP_NODE_SIZE.step.height / 2 - 12}px`,
        }}
      >
        {step.name}
      </div>

      {/* Selection indicator */}
      <div
        className={cn('absolute left-0 top-0 pointer-events-none rounded-sm w-full h-full', {
          'border-t-[2px] border-primary/70 border-solid': isSelected,
        })}
      />

      {/* Node content */}
      <div className='px-3 h-full w-full overflow-hidden'>
        <div className='flex items-center justify-center h-full w-full gap-3'>
          {/* Step icon */}
          <div className='flex items-center justify-center h-full'>
            <div className='w-12 h-12 flex items-center justify-center text-2xl bg-gray-100 rounded'>
              {getStepIcon()}
            </div>
          </div>

          {/* Step details */}
          <div className='grow flex flex-col items-start justify-center min-w-0 w-full'>
            <div className='flex items-center justify-between min-w-0 w-full'>
              <div className='text-sm truncate grow shrink font-medium'>
                {stepIndex}. {step.displayName}
              </div>

              {/* Action button */}
              <button
                className='p-1 size-7 hover:bg-gray-100 rounded transition-colors'
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  // Handle context menu or actions
                }}
              >
                <ChevronDown className='w-4 h-4 stroke-gray-500' />
              </button>
            </div>

            <div className='flex justify-between w-full items-center'>
              <div className='text-xs truncate text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap w-full'>
                {isTriggerStep ? 'Workflow Trigger' : 'Action Step'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* React Flow handles */}
      <Handle type='source' style={flowConstants.HANDLE_STYLING} position={Position.Bottom} />
      <Handle type='target' style={flowConstants.HANDLE_STYLING} position={Position.Top} />
    </div>
  )
})

ApStepNode.displayName = 'ApStepNode'
