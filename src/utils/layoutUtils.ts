import type { WorkflowNode } from '../types/workflow.types'

export interface LayoutUpdate {
  nodeId: string
  position: { x: number; y: number }
}

export const LAYOUT_CONFIG = {
  centerX: 400,
  branchSpacing: 180, // Spacing between branches
  nodeSpacing: 200,
  nodeWidth: 350,
}

export const calculateBranchPositions = (
  routerX: number,
  branchCount: number,
  branchSpacing: number = LAYOUT_CONFIG.branchSpacing,
): number[] => {
  const positions: number[] = []

  if (branchCount === 1) {
    return [routerX]
  }

  const totalWidth = branchSpacing * (branchCount - 1)
  const startX = routerX - totalWidth / 2

  for (let i = 0; i < branchCount; i++) {
    positions.push(startX + i * branchSpacing)
  }

  return positions
}

export const positionBranchNodes = (
  nodes: WorkflowNode[],
  branchX: number,
  startY: number,
  nodeSpacing: number = LAYOUT_CONFIG.nodeSpacing,
): LayoutUpdate[] => {
  let currentY = startY

  return nodes.map((node) => ({
    nodeId: node.id,
    position: {
      x: branchX,
      y: (currentY += nodeSpacing),
    },
  }))
}

export const layoutBranchNetwork = (
  router: WorkflowNode,
  branches: Map<string, WorkflowNode[]>,
  endConnector: WorkflowNode | null,
): LayoutUpdate[] => {
  const updates: LayoutUpdate[] = []
  const routerY = router.position.y
  const branchStartY = routerY + LAYOUT_CONFIG.nodeSpacing

  // Calculate branch X positions based on number of branches
  const branchCount = branches.size
  const branchXPositions = calculateBranchPositions(router.position.x, branchCount)

  // Find the longest branch
  let maxBranchLength = 0
  branches.forEach((branchNodes) => {
    maxBranchLength = Math.max(maxBranchLength, branchNodes.length)
  })

  // Position nodes in each branch
  let branchIndex = 0
  branches.forEach((branchNodes, branchId) => {
    const branchX = branchXPositions[branchIndex]
    let currentY = branchStartY

    branchNodes.forEach((node) => {
      updates.push({
        nodeId: node.id,
        position: { x: branchX, y: currentY },
      })
      currentY += LAYOUT_CONFIG.nodeSpacing
    })

    branchIndex++
  })

  // Position end connector below longest branch
  if (endConnector) {
    const endConnectorY = branchStartY + maxBranchLength * LAYOUT_CONFIG.nodeSpacing
    updates.push({
      nodeId: endConnector.id,
      position: { x: router.position.x, y: endConnectorY },
    })
  }

  return updates
}

export const getNodesInBranch = (nodes: WorkflowNode[], branchId: string): WorkflowNode[] => {
  return nodes.filter((node) => node.data.branchId === branchId)
}

export const getNodesBetweenRouterAndEnd = (
  nodes: WorkflowNode[],
  routerId: string,
  endConnectorId: string | null,
): Map<string, WorkflowNode[]> => {
  const branches = new Map<string, WorkflowNode[]>()

  // Group nodes by branch
  nodes.forEach((node) => {
    if (node.data.branchId) {
      const branch = branches.get(node.data.branchId) || []
      branch.push(node)
      branches.set(node.data.branchId, branch)
    }
  })

  // Sort nodes in each branch by Y position
  branches.forEach((branchNodes, branchId) => {
    branchNodes.sort((a, b) => a.position.y - b.position.y)
    branches.set(branchId, branchNodes)
  })

  return branches
}
