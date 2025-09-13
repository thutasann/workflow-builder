
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
  LOOP_START_EDGE = 'loopStartEdge',
  LOOP_RETURN_EDGE = 'loopReturnEdge',
  ROUTER_START_EDGE = 'routerStartEdge',
  ROUTER_END_EDGE = 'routerEndEdge',
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
  settings: {
    items: string // Expression that evaluates to an array
  }
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

export interface ApLoopStartEdge {
  id: string
  source: string
  target: string
  type: ApEdgeType.LOOP_START_EDGE
  data: {
    isLoopEmpty: boolean
  }
}

export interface ApLoopReturnEdge {
  id: string
  source: string
  target: string
  type: ApEdgeType.LOOP_RETURN_EDGE
  data: {
    parentStepName: string
    isLoopEmpty: boolean
    drawArrowHeadAfterEnd: boolean
    verticalSpaceBetweenReturnNodeStartAndEnd: number
  }
}

export type ApEdge = ApStraightLineEdge | ApRouterStartEdge | ApRouterEndEdge | ApLoopStartEdge | ApLoopReturnEdge

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

