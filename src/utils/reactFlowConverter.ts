import type { Node, Edge } from '@xyflow/react'
import type { ApGraph, ApNode, ApEdge } from '../types/workflow.types'

/**
 * Convert our custom ApGraph to React Flow compatible format
 */
export const convertApGraphToReactFlow = (
  graph: ApGraph,
): {
  nodes: Node[]
  edges: Edge[]
} => {
  // Convert nodes
  const nodes: Node[] = graph.nodes.map((apNode: ApNode) => ({
    id: apNode.id,
    type: apNode.type,
    position: apNode.position,
    data: apNode.data as Record<string, unknown>,
    selectable: apNode.selectable,
    draggable: 'draggable' in apNode ? apNode.draggable || false : false,
    style: 'style' in apNode ? apNode.style : undefined,
  }))

  // Convert edges with proper error handling
  const edges: Edge[] = graph.edges.map((apEdge: ApEdge) => {
    // Ensure source and target are valid
    if (!apEdge.source || !apEdge.target) {
      console.error('Invalid edge detected:', apEdge)
      throw new Error(`Edge ${apEdge.id} missing source or target`)
    }

    // Check if source and target nodes exist
    const sourceExists = nodes.some((node) => node.id === apEdge.source)
    const targetExists = nodes.some((node) => node.id === apEdge.target)

    if (!sourceExists) {
      console.error(`Source node ${apEdge.source} not found for edge ${apEdge.id}`)
      console.log(
        'Available nodes:',
        nodes.map((n) => n.id),
      )
      throw new Error(`Source node ${apEdge.source} not found`)
    }

    if (!targetExists) {
      console.error(`Target node ${apEdge.target} not found for edge ${apEdge.id}`)
      console.log(
        'Available nodes:',
        nodes.map((n) => n.id),
      )
      throw new Error(`Target node ${apEdge.target} not found`)
    }

    return {
      id: apEdge.id,
      source: apEdge.source,
      target: apEdge.target,
      type: apEdge.type,
      data: apEdge.data,
    }
  })

  return { nodes, edges }
}
