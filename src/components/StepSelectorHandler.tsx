import React from 'react'
import { useWorkflow } from '../context/WorkflowContext'
import { FlowActionType, BranchExecutionType } from '../types/workflow.types'
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
      case 'loop':
        actionType = FlowActionType.LOOP_ON_ITEMS
        break
      case 'code':
      case 'http':
        actionType = FlowActionType.CODE
        break
      default:
        actionType = FlowActionType.PIECE // Default to PIECE for integration actions
    }

    // Create new action
    let newAction: any = {
      name: `step-${Date.now()}`,
      displayName: option.label,
      type: actionType,
      settings: {},
    }

    // For routers, add the children array with 2 branches (Branch 1 and Otherwise)
    if (actionType === FlowActionType.ROUTER) {
      newAction = {
        ...newAction,
        settings: {
          branches: [{ branchName: 'Branch 1', branchType: BranchExecutionType.CONDITION }],
        },
        children: [undefined, undefined], // 1 condition + 1 otherwise
      }
    }

    // For loops, add the firstLoopAction
    if (actionType === FlowActionType.LOOP_ON_ITEMS) {
      newAction = {
        ...newAction,
        settings: {
          items: '', // Empty expression initially
        },
        firstLoopAction: undefined,
      }
    }

    // Add the action to the workflow
    addAction(stepSelectorState.parentStepName, newAction, stepSelectorState.branchIndex)
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
