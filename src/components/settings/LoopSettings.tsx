import React from 'react'
import { useWorkflow } from '../../context/WorkflowContext'
import type { LoopOnItemsAction } from '../../types/workflow.types'

interface LoopSettingsProps {
  step: LoopOnItemsAction
}

export const LoopSettings: React.FC<LoopSettingsProps> = ({ step }) => {
  const { updateStep } = useWorkflow()

  const handleItemsChange = (value: string) => {
    updateStep(step.name, {
      settings: {
        ...step.settings,
        items: value
      }
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Items to Loop Over
        </label>
        <input
          type="text"
          value={step.settings.items || ''}
          onChange={(e) => handleItemsChange(e.target.value)}
          placeholder="e.g., {{trigger.data.items}}"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-2 text-xs text-gray-500">
          Enter an expression that evaluates to an array. The loop will iterate over each item.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-1">How it works</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Each item in the array will be processed sequentially</li>
          <li>• Access the current item with <code className="bg-blue-100 px-1 rounded">{'{{loopItem}}'}</code></li>
          <li>• Access the current index with <code className="bg-blue-100 px-1 rounded">{'{{loopIndex}}'}</code></li>
        </ul>
      </div>

      <div className="border-t pt-4">
        <p className="text-xs text-gray-500">
          The loop will execute the actions inside for each item in the array. If the array is empty, the loop will be skipped.
        </p>
      </div>
    </div>
  )
}