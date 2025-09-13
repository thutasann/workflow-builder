import React, { useState } from 'react'
import { GripVertical, Edit2, Trash2, Check, X } from 'lucide-react'
import type { RouterAction } from '../../types/workflow.types'

interface BranchesListProps {
  step: RouterAction
  selectedBranchIndex: number | null
  setSelectedBranchIndex: (index: number | null) => void
  onDeleteBranch: (index: number) => void
  onRenameBranch: (index: number, newName: string) => void
  onMoveBranch: (sourceIndex: number, targetIndex: number) => void
}

export const BranchesList: React.FC<BranchesListProps> = ({
  step,
  selectedBranchIndex,
  setSelectedBranchIndex,
  onDeleteBranch,
  onRenameBranch,
  onMoveBranch,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleStartEdit = (index: number, currentName: string) => {
    setEditingIndex(index)
    setEditingName(currentName)
  }

  const handleSaveEdit = (index: number) => {
    if (editingName.trim()) {
      onRenameBranch(index, editingName.trim())
    }
    setEditingIndex(null)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingName('')
  }

  // Get branch display names
  const getBranchDisplayName = (index: number) => {
    if (index < step.settings.branches.length) {
      return step.settings.branches[index].branchName
    }
    return 'Otherwise'
  }

  return (
    <div className='space-y-2'>
      {step.children.map((_, index) => {
        const isOtherwise = index === step.children.length - 1
        const displayName = getBranchDisplayName(index)
        const isEditing = editingIndex === index

        return (
          <div
            key={index}
            className={`flex items-center gap-2 p-3 rounded-md border transition-colors cursor-pointer ${
              selectedBranchIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedBranchIndex(index)}
          >
            {!isOtherwise && <GripVertical className='w-4 h-4 text-gray-400 cursor-move' />}

            <div className='flex-1'>
              {isEditing ? (
                <div className='flex items-center gap-2'>
                  <input
                    type='text'
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className='flex-1 px-2 py-1 text-sm border rounded'
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(index)
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSaveEdit(index)
                    }}
                    className='p-1 text-green-600 hover:bg-green-50 rounded'
                  >
                    <Check className='w-4 h-4' />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelEdit()
                    }}
                    className='p-1 text-red-600 hover:bg-red-50 rounded'
                  >
                    <X className='w-4 h-4' />
                  </button>
                </div>
              ) : (
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>{displayName}</span>
                  {!isOtherwise && (
                    <div className='flex items-center gap-1'>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(index, displayName)
                        }}
                        className='p-1 text-gray-600 hover:bg-gray-100 rounded'
                      >
                        <Edit2 className='w-4 h-4' />
                      </button>
                      {step.settings.branches.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteBranch(index)
                          }}
                          className='p-1 text-red-600 hover:bg-red-50 rounded'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
