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
    const nodes = getNodes()

    // Find source and target nodes
    const sourceNode = nodes.find((n) => n.id === source)
    const targetNode = nodes.find((n) => n.id === target)

    if (!sourceNode || !targetNode) return

    // Calculate position: same X as other nodes, Y in the middle
    const newY = (sourceNode.position.y + targetNode.position.y) / 2
    const nodeSpacing = 200 // Same spacing as in App.tsx

    const newNode = {
      id: newNodeId,
      type: 'action' as const,
      position: {
        x: sourceNode.position.x, // Same X position as other nodes
        y: newY,
      },
      data: {
        label: 'New Action',
        type: 'action' as const,
        stepNumber: `${nodes.filter((n) => n.type === 'action' && n.id !== 'end-placeholder').length + 1}`,
        integrationName: 'Custom',
      },
    }

    // Add new node
    setNodes((nodes) => {
      const allNodes = [...nodes, newNode]

      // Sort nodes by Y position and recalculate positions to maintain even spacing
      const sortedNodes = allNodes.sort((a, b) => a.position.y - b.position.y)

      // Filter out placeholder and get the first real node
      const realNodes = sortedNodes.filter((n) => n.id !== 'end-placeholder')
      const placeholderNode = sortedNodes.find((n) => n.id === 'end-placeholder')
      
      if (realNodes.length === 0) return allNodes

      let currentY = realNodes[0].position.y

      // Update positions for all real nodes
      const updatedRealNodes = realNodes.map((node, index) => {
        const updatedNode = {
          ...node,
          position: { ...node.position, y: currentY },
        }

        // Update step numbers
        if (node.type === 'trigger') {
          updatedNode.data = {
            ...node.data,
            stepNumber: '1',
          }
        } else if (node.type === 'action') {
          updatedNode.data = {
            ...node.data,
            stepNumber: `${index + 1}`, // Will be 2, 3, 4, etc. for actions
          }
        }

        currentY += nodeSpacing
        return updatedNode
      })

      // Update placeholder position if it exists
      if (placeholderNode) {
        const updatedPlaceholder = {
          ...placeholderNode,
          position: { ...placeholderNode.position, y: currentY },
        }
        return [...updatedRealNodes, updatedPlaceholder]
      }

      return updatedRealNodes
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
