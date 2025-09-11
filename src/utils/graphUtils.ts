import {
  type ApGraph,
  type BoundingBox,
  type FlowTrigger,
  type FlowAction,
  type RouterAction,
  type LoopOnItemsAction,
  type ApStepNode,
  type ApGraphEndNode,
  type ApStraightLineEdge,
  type ApBigAddButtonNode,
  type ApButtonData,
  ApNodeType,
  ApEdgeType,
  FlowActionType,
  StepLocationRelativeToParent,
} from '../types/workflow.types'
import { flowConstants } from './flowConstants'

// Create a big add button graph for empty branches/loops
const createBigAddButtonGraph = (
  parentStep: LoopOnItemsAction | RouterAction,
  nodeData: ApButtonData,
): ApGraph => {
  const bigAddButtonNode: ApBigAddButtonNode = {
    id: `${parentStep.name}-big-add-button-${nodeData.edgeId}`,
    type: ApNodeType.BIG_ADD_BUTTON,
    position: { x: 0, y: 0 },
    data: nodeData,
    selectable: false,
    style: {
      pointerEvents: 'all',
    },
  }

  const graphEndNode: ApGraphEndNode = {
    id: `${parentStep.name}-subgraph-end-${nodeData.edgeId}`,
    type: ApNodeType.GRAPH_END_WIDGET,
    position: {
      x: flowConstants.AP_NODE_SIZE.step.width / 2,
      y: flowConstants.AP_NODE_SIZE.step.height + flowConstants.VERTICAL_SPACE_BETWEEN_STEPS,
    },
    data: {},
    selectable: false,
  }

  const straightLineEdge: ApStraightLineEdge = {
    id: `big-button-straight-line-for${nodeData.edgeId}`,
    source: `${parentStep.name}-big-add-button-${nodeData.edgeId}`,
    target: `${parentStep.name}-subgraph-end-${nodeData.edgeId}`,
    type: ApEdgeType.STRAIGHT_LINE,
    data: {
      drawArrowHead: false,
      hideAddButton: true,
      parentStepName: parentStep.name,
    },
  }

  return {
    nodes: [bigAddButtonNode, graphEndNode],
    edges: [straightLineEdge],
  }
}

// Create a step graph
const createStepGraph = (step: FlowAction | FlowTrigger, graphHeight: number): ApGraph => {
  const stepNode: ApStepNode = {
    id: step.name,
    type: ApNodeType.STEP,
    position: { x: 400, y: 100 }, // Center the node properly
    data: {
      step,
    },
    selectable: step.name !== 'trigger',
    draggable: true,
    style: {
      pointerEvents: 'all',
    },
  }

  const graphEndNode: ApGraphEndNode = {
    id: `${step.name}-subgraph-end`,
    type: ApNodeType.GRAPH_END_WIDGET,
    position: {
      x: 400 + flowConstants.AP_NODE_SIZE.step.width / 2 - 16, // Center align with step node (assuming end widget is ~32px wide)
      y: 100 + graphHeight,
    },
    data: {},
    selectable: false,
  }

  // Only create edge to graph end if there's no nextAction
  const edges: ApStraightLineEdge[] = []
  
  if (step.type !== FlowActionType.LOOP_ON_ITEMS && step.type !== FlowActionType.ROUTER) {
    if (!step.nextAction) {
      // Create edge to graph end only if this is the last step
      const straightLineEdge: ApStraightLineEdge = {
        id: `${step.name}-graph-end-edge`,
        source: step.name,
        target: `${step.name}-subgraph-end`,
        type: ApEdgeType.STRAIGHT_LINE,
        data: {
          drawArrowHead: false,
          parentStepName: step.name,
        },
      }
      edges.push(straightLineEdge)
    }
  }

  return {
    nodes: [stepNode, graphEndNode],
    edges,
  }
}

// Offset graph by x,y coordinates
export const offsetGraph = (graph: ApGraph, offset: { x: number; y: number }): ApGraph => {
  return {
    nodes: graph.nodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x + offset.x,
        y: node.position.y + offset.y,
      },
    })),
    edges: graph.edges,
  }
}

// Merge two graphs
export const mergeGraph = (graph1: ApGraph, graph2: ApGraph): ApGraph => {
  return {
    nodes: [...graph1.nodes, ...graph2.nodes],
    edges: [...graph1.edges, ...graph2.edges],
  }
}

// Calculate graph bounding box
export const calculateGraphBoundingBox = (graph: ApGraph): BoundingBox => {
  const nodesAffectingBoundingBox = graph.nodes.filter((node) =>
    flowConstants.doesNodeAffectBoundingBox(node.type),
  )

  if (nodesAffectingBoundingBox.length === 0) {
    return {
      width: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
  }

  const minX = Math.min(...nodesAffectingBoundingBox.map((node) => node.position.x))
  const minY = Math.min(...graph.nodes.map((node) => node.position.y))
  const maxX = Math.max(
    ...nodesAffectingBoundingBox.map(
      (node) => node.position.x + flowConstants.AP_NODE_SIZE.step.width,
    ),
  )
  const maxY = Math.max(...graph.nodes.map((node) => node.position.y))

  const width = maxX - minX
  const height = maxY - minY

  return {
    width,
    height,
    left: -minX + flowConstants.AP_NODE_SIZE.step.width / 2,
    right: maxX - flowConstants.AP_NODE_SIZE.step.width / 2,
    top: minY,
    bottom: maxY,
  }
}

// Build router child graph
const buildRouterChildGraph = (step: RouterAction): ApGraph => {
  const childGraphs = step.children.map((branch, index) => {
    return branch
      ? buildGraph(branch)
      : createBigAddButtonGraph(step, {
          parentStepName: step.name,
          stepLocationRelativeToParent: StepLocationRelativeToParent.INSIDE_BRANCH,
          branchIndex: index,
          edgeId: `${step.name}-branch-${index}-start-edge`,
        })
  })

  const childGraphsAfterOffset = offsetRouterChildSteps(childGraphs)
  const maxHeight = Math.max(
    ...childGraphsAfterOffset.map((cg) => calculateGraphBoundingBox(cg).height),
  )

  const subgraphEndNode: ApGraphEndNode = {
    id: `${step.name}-branch-subgraph-end`,
    type: ApNodeType.GRAPH_END_WIDGET,
    position: {
      x: flowConstants.AP_NODE_SIZE.step.width / 2,
      y:
        flowConstants.AP_NODE_SIZE.step.height +
        flowConstants.VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD +
        maxHeight +
        flowConstants.ARC_LENGTH +
        flowConstants.VERTICAL_SPACE_BETWEEN_STEPS,
    },
    data: {},
    selectable: false,
  }

  return {
    nodes: [...childGraphsAfterOffset.map((cg) => cg.nodes).flat(), subgraphEndNode],
    edges: [...childGraphsAfterOffset.map((cg) => cg.edges).flat()],
  }
}

// ActivePieces branch positioning algorithm
const offsetRouterChildSteps = (childGraphs: ApGraph[]): ApGraph[] => {
  const childGraphsBoundingBoxes = childGraphs.map((childGraph) =>
    calculateGraphBoundingBox(childGraph),
  )

  const totalWidth =
    childGraphsBoundingBoxes.reduce((acc, current) => acc + current.width, 0) +
    flowConstants.HORIZONTAL_SPACE_BETWEEN_NODES * (childGraphs.length - 1)

  let deltaLeftX =
    -(
      totalWidth -
      childGraphsBoundingBoxes[0].left -
      childGraphsBoundingBoxes[childGraphs.length - 1].right
    ) /
      2 -
    childGraphsBoundingBoxes[0].left

  return childGraphsBoundingBoxes.map((childGraphBoundingBox, index) => {
    const x = deltaLeftX + childGraphBoundingBox.left
    deltaLeftX += childGraphBoundingBox.width + flowConstants.HORIZONTAL_SPACE_BETWEEN_NODES
    return offsetGraph(childGraphs[index], {
      x,
      y:
        flowConstants.AP_NODE_SIZE.step.height +
        flowConstants.VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD,
    })
  })
}

// Create edge between two sequential steps
const createInterStepEdge = (currentStep: FlowAction | FlowTrigger, nextStep: FlowAction): ApStraightLineEdge => {
  return {
    id: `${currentStep.name}-${nextStep.name}-edge`,
    source: currentStep.name,
    target: nextStep.name,
    type: ApEdgeType.STRAIGHT_LINE,
    data: {
      drawArrowHead: false,
      parentStepName: currentStep.name,
    },
  }
}

// Main graph building function (recursive)
export const buildGraph = (step: FlowAction | FlowTrigger | undefined): ApGraph => {
  if (!step) {
    return {
      nodes: [],
      edges: [],
    }
  }

  const graph: ApGraph = createStepGraph(
    step,
    flowConstants.AP_NODE_SIZE.step.height + flowConstants.VERTICAL_SPACE_BETWEEN_STEPS,
  )

  const childGraph =
    step.type === FlowActionType.LOOP_ON_ITEMS
      ? null // TODO: implement loop child graph
      : step.type === FlowActionType.ROUTER
      ? buildRouterChildGraph(step as RouterAction)
      : null

  const graphWithChild = childGraph ? mergeGraph(graph, childGraph) : graph
  const nextStepGraph = buildGraph(step.nextAction)

  // Create edge between current step and next step if nextAction exists
  const interStepEdges: ApStraightLineEdge[] = []
  if (step.nextAction && step.type !== FlowActionType.LOOP_ON_ITEMS && step.type !== FlowActionType.ROUTER) {
    interStepEdges.push(createInterStepEdge(step, step.nextAction))
  }

  const mergedGraph = mergeGraph(
    graphWithChild,
    offsetGraph(nextStepGraph, {
      x: 0,
      y: calculateGraphBoundingBox(graphWithChild).height,
    }),
  )

  // Add inter-step edges
  return {
    nodes: mergedGraph.nodes,
    edges: [...mergedGraph.edges, ...interStepEdges],
  }
}

// Convert FlowVersion to graph (main entry point)
export const convertFlowVersionToGraph = (trigger: FlowTrigger): ApGraph => {
  const graph = buildGraph(trigger)
  const graphEndWidget = graph.nodes.findLast(
    (node) => node.type === ApNodeType.GRAPH_END_WIDGET,
  ) as ApGraphEndNode

  if (graphEndWidget) {
    graphEndWidget.data.showWidget = true
  } else {
    console.warn('Flow end widget not found')
  }

  return graph
}

// Create focus parameters for React Flow
export const createFocusStepInGraphParams = (stepName: string) => {
  return {
    nodes: [{ id: stepName }],
    duration: 1000,
    maxZoom: 1.25,
    minZoom: 1.25,
  }
}