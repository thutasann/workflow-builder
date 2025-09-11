import type { Node, Edge, NodeProps } from '@xyflow/react'

// ActivePieces-inspired Node Types
export enum ApNodeType {
  STEP = 'step',
  BIG_ADD_BUTTON = 'bigAddButton',
  ADD_BUTTON = 'addButton',
  LOOP_RETURN_NODE = 'loopReturnNode',
  GRAPH_END_WIDGET = 'graphEndWidget',
}

// ActivePieces-inspired Edge Types
export enum ApEdgeType {
  STRAIGHT_LINE = 'straightLine',
  LOOP_START_EDGE = 'loopStart',
  LOOP_RETURN_EDGE = 'loopReturn',
  ROUTER_START_EDGE = 'routerStart',
  ROUTER_END_EDGE = 'routerEnd',
}

// Flow Action Types (from ActivePieces)
export enum FlowActionType {
  CODE = 'CODE',
  PIECE = 'PIECE',
  LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
  ROUTER = 'ROUTER',
}

export enum FlowTriggerType {
  EMPTY = 'EMPTY',
  PIECE = 'PIECE',
}

export enum BranchExecutionType {
  CONDITION = 'CONDITION',
  FALLBACK = 'FALLBACK',
}

export enum StepLocationRelativeToParent {
  AFTER = 'AFTER',
  INSIDE_LOOP = 'INSIDE_LOOP',
  INSIDE_BRANCH = 'INSIDE_BRANCH',
}

// Flow Structure Types
export interface FlowTrigger {
  name: string
  displayName: string
  type: FlowTriggerType
  nextAction?: FlowAction
  settings?: Record<string, any>
}

export interface FlowAction {
  name: string
  displayName: string
  type: FlowActionType
  nextAction?: FlowAction
  settings?: Record<string, any>
  skip?: boolean
}

export interface LoopOnItemsAction extends FlowAction {
  type: FlowActionType.LOOP_ON_ITEMS
  firstLoopAction?: FlowAction
}

export interface RouterAction extends FlowAction {
  type: FlowActionType.ROUTER
  settings: {
    branches: Array<{
      branchName: string
      branchType: BranchExecutionType
      conditions?: any[][]
    }>
  }
  children: (FlowAction | undefined)[]
}

// Graph Types (ActivePieces-inspired)
export interface ApStepNode {
  id: string
  type: ApNodeType.STEP
  position: { x: number; y: number }
  data: {
    step: FlowAction | FlowTrigger
  }
  selectable: boolean
  draggable?: boolean
  style?: Record<string, any>
}

export interface ApBigAddButtonNode {
  id: string
  type: ApNodeType.BIG_ADD_BUTTON
  position: { x: number; y: number }
  data: ApButtonData
  selectable: boolean
  style?: Record<string, any>
}

export interface ApGraphEndNode {
  id: string
  type: ApNodeType.GRAPH_END_WIDGET
  position: { x: number; y: number }
  data: {
    showWidget?: boolean
  }
  selectable: boolean
}

export interface ApLoopReturnNode {
  id: string
  type: ApNodeType.LOOP_RETURN_NODE
  position: { x: number; y: number }
  data: Record<string, any>
  selectable: boolean
}

export type ApNode = ApStepNode | ApBigAddButtonNode | ApGraphEndNode | ApLoopReturnNode

// Edge Data Types
export interface ApStraightLineEdge {
  id: string
  source: string
  target: string
  type: ApEdgeType.STRAIGHT_LINE
  data: {
    drawArrowHead: boolean
    hideAddButton?: boolean
    parentStepName: string
  }
}

export interface ApRouterStartEdge {
  id: string
  source: string
  target: string
  type: ApEdgeType.ROUTER_START_EDGE
  data: {
    isBranchEmpty: boolean
    label: string
    branchIndex: number
    stepLocationRelativeToParent: StepLocationRelativeToParent
    drawHorizontalLine: boolean
    drawStartingVerticalLine: boolean
  }
}

export interface ApRouterEndEdge {
  id: string
  source: string
  target: string
  type: ApEdgeType.ROUTER_END_EDGE
  data: {
    drawEndingVerticalLine: boolean
    verticalSpaceBetweenLastNodeInBranchAndEndLine: number
    drawHorizontalLine: boolean
    routerOrBranchStepName: string
    isNextStepEmpty: boolean
  }
}

export type ApEdge = ApStraightLineEdge | ApRouterStartEdge | ApRouterEndEdge

// Button Data for Add Buttons
export interface ApButtonData {
  parentStepName: string
  stepLocationRelativeToParent: StepLocationRelativeToParent
  branchIndex?: number
  edgeId: string
}

// Graph Structure
export interface ApGraph {
  nodes: ApNode[]
  edges: ApEdge[]
}

// Flow Version (main flow state)
export interface FlowVersion {
  id: string
  trigger: FlowTrigger
  version: number
}

// Bounding Box for Layout Calculations
export interface BoundingBox {
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
}

// Legacy types for backward compatibility
export type NodeType = 'trigger' | 'action' | 'router' | 'branch' | 'endConnector' | 'branchLabel'

export interface WorkflowNodeData {
  label: string
  type: NodeType
  icon?: string
  description?: string
  config?: Record<string, any>
  integrationLogo?: string
  integrationName?: string
  stepNumber?: string
  branchId?: string
  [key: string]: any
}

export type WorkflowNode = Node<WorkflowNodeData, NodeType>

export type WorkflowEdge = Edge<{
  label?: string
  condition?: any
  branchId?: string
  branchCondition?: string
  branchLabel?: string
  branchIndex?: number
  isOtherwiseBranch?: boolean
}>

export interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: string | null
  selectedEdge: string | null
  branches: Map<string, any>
  nodePositions: Map<string, any>
}

export type CustomNodeProps = NodeProps<WorkflowNode>
