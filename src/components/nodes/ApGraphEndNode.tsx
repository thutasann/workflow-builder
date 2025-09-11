import { type NodeProps, Handle, Position } from '@xyflow/react'
import { Flag } from 'lucide-react'
import React from 'react'

import type { ApGraphEndNode as ApGraphEndNodeType } from '../../types/workflow.types'
import { flowConstants } from '../../utils/flowConstants'

/**
 * ApGraphEndNode - Invisible node that marks the end of a graph/subgraph
 * Used for positioning and layout calculations, usually not visible to users
 */
export const ApGraphEndNode = React.memo(({ data }: NodeProps & Omit<ApGraphEndNodeType, 'position'>) => {
  // Only show the widget if explicitly requested
  if (!data.showWidget) {
    return (
      <div
        style={{
          width: '0px',
          height: '0px',
          position: 'absolute',
          pointerEvents: 'none',
        }}
      >
        {/* Always include the target handle for edges to connect to */}
        <Handle type='target' style={flowConstants.HANDLE_STYLING} position={Position.Top} />
      </div>
    )
  }

  // Show end widget for the main flow
  return (
    <div className='flex items-center justify-center relative'>
      <div className='bg-gray-100 border border-gray-300 rounded-full p-2 text-gray-500'>
        <Flag className='w-4 h-4' />
      </div>
      {/* Target handle for edges */}
      <Handle type='target' style={flowConstants.HANDLE_STYLING} position={Position.Top} />
    </div>
  )
})

ApGraphEndNode.displayName = 'ApGraphEndNode'
