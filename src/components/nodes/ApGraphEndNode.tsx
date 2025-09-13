import { type NodeProps, Handle, Position } from '@xyflow/react'
import React, { useRef } from 'react'

import type { ApGraphEndNode as ApGraphEndNodeType } from '../../types/workflow.types'
import { flowConstants } from '../../utils/flowConstants'

/**
 * ApGraphEndNode - Invisible node that marks the end of a graph/subgraph
 * Shows "End" widget when data.showWidget is true
 */
export const ApGraphEndNode = React.memo(({ data }: NodeProps & Omit<ApGraphEndNodeType, 'position'>) => {
  const elementRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div className='h-[1px] w-[1px] relative'>
        {data.showWidget && (
          <div
            ref={elementRef}
            style={{ left: `-${(elementRef.current?.clientWidth || 0) / 2}px` }}
            className='px-2.5 absolute py-1.5 bg-accent text-foreground/70 rounded-full animate-fade'
            key={'flow-end-button'}
          >
            End
          </div>
        )}
      </div>

      <Handle type='target' position={Position.Top} style={flowConstants.HANDLE_STYLING} />
      <Handle type='source' position={Position.Bottom} style={flowConstants.HANDLE_STYLING} />
    </>
  )
})

ApGraphEndNode.displayName = 'ApGraphEndNode'
