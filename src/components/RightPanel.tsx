import React from 'react'
import { X } from 'lucide-react'
import { useWorkflow } from '../context/WorkflowContext'
import { FlowActionType } from '../types/workflow.types'
import { RouterSettings } from './settings/RouterSettings'
import { LoopSettings } from './settings/LoopSettings'

export const RightPanel: React.FC = () => {
  const { selectedStep, flowVersion, selectStep } = useWorkflow()

  // Find the selected step in the flow
  const findStep = (stepName: string) => {
    const searchStep = (step: any): any => {
      if (step.name === stepName) return step

      // Search in nextAction
      if (step.nextAction) {
        const found = searchStep(step.nextAction)
        if (found) return found
      }

      // Search in router branches
      if (step.type === FlowActionType.ROUTER && step.children) {
        for (const child of step.children) {
          if (child) {
            const found = searchStep(child)
            if (found) return found
          }
        }
      }

      return null
    }

    return searchStep(flowVersion.trigger)
  }

  const step = selectedStep ? findStep(selectedStep) : null

  const handleClose = () => {
    selectStep(null)
  }

  if (!selectedStep || !step) return null

  return (
    <div className='fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50'>
      <div className='flex items-center justify-between p-4 border-b border-gray-200'>
        <h2 className='text-lg font-semibold'>{step.displayName} Settings</h2>
        <button onClick={handleClose} className='p-1 rounded hover:bg-gray-100 transition-colors'>
          <X className='w-5 h-5' />
        </button>
      </div>

      <div className='p-4 overflow-y-auto h-[calc(100%-73px)]'>
        {step.type === FlowActionType.ROUTER ? (
          <RouterSettings step={step} />
        ) : step.type === FlowActionType.LOOP_ON_ITEMS ? (
          <LoopSettings step={step} />
        ) : (
          <div className='text-gray-500'>Settings for {step.displayName} will be implemented here</div>
        )}
      </div>
    </div>
  )
}
