import React from 'react'
import { useWorkflow } from '../context/WorkflowContext'
import { FlowActionType } from '../types/workflow.types'
import { StepSelector } from './StepSelector'

export const StepSelectorHandler: React.FC = () => {
  const { stepSelectorState, closeStepSelector, addAction } = useWorkflow()

  const handleNodeSelect = (option: any) => {
    if (!stepSelectorState.isOpen || !stepSelectorState.parentStepName) {
      return
    }

    // Map the UI option to our FlowAction type
    let actionType: FlowActionType
    switch (option.id) {
      case 'router':
        actionType = FlowActionType.ROUTER
        break
      case 'code':
      case 'http':
        actionType = FlowActionType.CODE
        break
      default:
        actionType = FlowActionType.PIECE // Default to PIECE for integration actions
    }

    // Create new action
    const newAction = {
      name: `step-${Date.now()}`,
      displayName: option.label,
      type: actionType,
      settings: {},
    }

    // Add the action to the workflow
    addAction(stepSelectorState.parentStepName, newAction)
    closeStepSelector()
  }

  return (
    <StepSelector
      isOpen={stepSelectorState.isOpen}
      onClose={closeStepSelector}
      onSelect={handleNodeSelect}
      position={stepSelectorState.position}
    />
  )
}
