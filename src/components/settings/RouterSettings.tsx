import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { useWorkflow } from '../../context/WorkflowContext'
import type { RouterAction } from '../../types/workflow.types'
import { BranchExecutionType } from '../../types/workflow.types'
import { BranchesList } from './BranchesList'

interface RouterSettingsProps {
  step: RouterAction
}

export const RouterSettings: React.FC<RouterSettingsProps> = ({ step }) => {
  const { updateStep } = useWorkflow()
  const [selectedBranchIndex, setSelectedBranchIndex] = useState<number | null>(null)

  const handleAddBranch = () => {
    const newBranch = {
      branchName: `Branch ${step.settings.branches.length + 1}`,
      branchType: BranchExecutionType.CONDITION,
      conditions: [],
    }

    const newChildren = [...step.children, undefined]

    updateStep(step.name, {
      settings: {
        ...step.settings,
        branches: [...step.settings.branches, newBranch],
      },
      children: newChildren,
    } as Partial<RouterAction>)
  }

  const handleDeleteBranch = (index: number) => {
    // Don't allow deletion if only 2 branches remain (1 condition + 1 otherwise)
    if (step.settings.branches.length <= 1) return

    const newBranches = step.settings.branches.filter((_, i) => i !== index)
    const newChildren = step.children.filter((_, i) => i !== index)

    updateStep(step.name, {
      settings: {
        ...step.settings,
        branches: newBranches,
      },
      children: newChildren,
    } as Partial<RouterAction>)

    setSelectedBranchIndex(null)
  }

  const handleRenameBranch = (index: number, newName: string) => {
    const newBranches = [...step.settings.branches]
    newBranches[index] = {
      ...newBranches[index],
      branchName: newName,
    }

    updateStep(step.name, {
      settings: {
        ...step.settings,
        branches: newBranches,
      },
    } as Partial<RouterAction>)
  }

  const handleMoveBranch = (sourceIndex: number, targetIndex: number) => {
    const newBranches = [...step.settings.branches]
    const newChildren = [...step.children]

    // Move branch
    const [movedBranch] = newBranches.splice(sourceIndex, 1)
    newBranches.splice(targetIndex, 0, movedBranch)

    // Move corresponding child
    const [movedChild] = newChildren.splice(sourceIndex, 1)
    newChildren.splice(targetIndex, 0, movedChild)

    updateStep(step.name, {
      settings: {
        ...step.settings,
        branches: newBranches,
      },
      children: newChildren,
    } as Partial<RouterAction>)
  }

  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-medium text-gray-700 mb-2'>Branches</h3>
        <p className='text-xs text-gray-500 mb-4'>
          Add multiple branches to execute different actions based on conditions
        </p>
      </div>

      <BranchesList
        step={step}
        selectedBranchIndex={selectedBranchIndex}
        setSelectedBranchIndex={setSelectedBranchIndex}
        onDeleteBranch={handleDeleteBranch}
        onRenameBranch={handleRenameBranch}
        onMoveBranch={handleMoveBranch}
      />

      <button
        onClick={handleAddBranch}
        className='w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm'
      >
        <Plus className='w-4 h-4' />
        Add Branch
      </button>

      <div className='border-t pt-4'>
        <p className='text-xs text-gray-500'>The "Otherwise" branch will always execute if no other conditions match</p>
      </div>
    </div>
  )
}
