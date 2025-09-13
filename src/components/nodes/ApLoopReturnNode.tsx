import React from 'react'
import type { NodeProps } from '@xyflow/react'
import { Position, Handle } from '@xyflow/react'
import { flowConstants } from '../../utils/flowConstants'

export const ApLoopReturnNode: React.FC<NodeProps> = () => {
  return (
    <div
      className='relative'
      style={{
        width: flowConstants.AP_NODE_SIZE.loopReturnNode.width,
        height: flowConstants.AP_NODE_SIZE.loopReturnNode.height,
      }}
    >
      {/* Invisible handles for connections */}
      <Handle type='target' position={Position.Top} id='top' style={flowConstants.HANDLE_STYLING} />
      <Handle type='source' position={Position.Bottom} id='bottom' style={flowConstants.HANDLE_STYLING} />

      {/* Visual representation - just an invisible node for layout */}
      <div className='w-full h-full' />
    </div>
  )
}
