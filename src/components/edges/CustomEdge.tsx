import React from 'react'
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getStraightPath, useReactFlow } from '@xyflow/react'

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const { setNodes, setEdges, getNodes } = useReactFlow()
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const handleAddNode = () => {
    const newNodeId = `node_${Date.now()}`
    const currentNodes = getNodes()
    const nodeSpacing = 200 // Same spacing as in App.tsx

    // Find source and target nodes
    const sourceNode = currentNodes.find((n) => n.id === source)
    const targetNode = currentNodes.find((n) => n.id === target)

    if (!sourceNode || !targetNode) return

    setNodes((nodes) => {
      // Create the new node with a temporary position between source and target
      const newNode = {
        id: newNodeId,
        type: 'action' as const,
        position: {
          x: sourceNode.position.x,
          y: (sourceNode.position.y + targetNode.position.y) / 2, // Place between source and target
        },
        data: {
          label: 'New Action',
          type: 'action' as const,
          stepNumber: '',
          integrationName: 'Custom',
        },
      }

      // Add the new node to the array
      let updatedNodes = [...nodes, newNode]

      // Sort all nodes by Y position
      updatedNodes.sort((a, b) => a.position.y - b.position.y)

      // Find the trigger node to get the starting position
      const triggerNode = updatedNodes.find((n) => n.type === 'trigger')
      const startY = triggerNode ? triggerNode.position.y : 100

      // Reposition all nodes with consistent spacing
      let currentY = startY
      let actionCount = 0

      updatedNodes = updatedNodes.map((node) => {
        const updatedNode = {
          ...node,
          position: { ...node.position, y: currentY }
        }

        // Update step numbers
        if (node.type === 'trigger') {
          updatedNode.data = { ...node.data, stepNumber: '1' }
        } else if (node.type === 'action' && node.id !== 'end-placeholder') {
          actionCount++
          updatedNode.data = { ...node.data, stepNumber: `${actionCount + 1}` }
        }

        // Only increment Y for non-placeholder nodes
        if (node.id !== 'end-placeholder' || updatedNodes.filter(n => n.id !== 'end-placeholder').length > 1) {
          currentY += nodeSpacing
        }
        
        return updatedNode
      })

      return updatedNodes
    })

    // Update edges
    setEdges((edges) => {
      const filteredEdges = edges.filter((edge) => edge.id !== id)

      return [
        ...filteredEdges,
        {
          id: `${source}-${newNodeId}`,
          source: source,
          target: newNodeId,
          type: 'custom',
        },
        {
          id: `${newNodeId}-${target}`,
          source: newNodeId,
          target: target,
          type: 'custom',
        },
      ]
    })
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            className='edge-button'
            onClick={handleAddNode}
            style={{
              width: '28px',
              height: '28px',
              background: '#9ca3af',
              border: '3px solid #f3f4f6',
              borderRadius: '6px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6b7280'
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#9ca3af'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
