import { ApNodeType } from '../types/workflow.types'

// Layout constants based on ActivePieces
const ARC_LENGTH = 15
const ARC_LEFT = `a${ARC_LENGTH},${ARC_LENGTH} 0 0,0 -${ARC_LENGTH},${ARC_LENGTH}`
const ARC_RIGHT = `a${ARC_LENGTH},${ARC_LENGTH} 0 0,1 ${ARC_LENGTH},${ARC_LENGTH}`
const ARC_LEFT_DOWN = `a${ARC_LENGTH},${ARC_LENGTH} 0 0,1 -${ARC_LENGTH},${ARC_LENGTH}`
const ARC_RIGHT_DOWN = `a${ARC_LENGTH},${ARC_LENGTH} 0 0,0 ${ARC_LENGTH},${ARC_LENGTH}`
const ARC_RIGHT_UP = `a${ARC_LENGTH},${ARC_LENGTH} 0 0,1 -${ARC_LENGTH},-${ARC_LENGTH}`
const ARC_LEFT_UP = `a-${ARC_LENGTH},-${ARC_LENGTH} 0 0,0 ${ARC_LENGTH},-${ARC_LENGTH}`
const ARROW_DOWN = 'm6 -6 l-6 6 m-6 -6 l6 6'

// Spacing constants
const VERTICAL_SPACE_BETWEEN_STEP_AND_LINE = 7
const VERTICAL_SPACE_BETWEEN_STEPS = 85
const VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD = VERTICAL_SPACE_BETWEEN_STEPS * 1.5 + 2 * ARC_LENGTH
const LABEL_HEIGHT = 30
const LABEL_VERTICAL_PADDING = 12
const VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD = VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD + LABEL_HEIGHT
const LINE_WIDTH = 1.5
const HORIZONTAL_SPACE_BETWEEN_NODES = 80

// Node size constants (ActivePieces dimensions)
const AP_NODE_SIZE = {
  // Camel case for easier access
  bigAddButton: {
    height: 50,
    width: 50,
  },
  addButton: {
    height: 18,
    width: 18,
  },
  step: {
    height: 70,
    width: 260,
  },
  loopReturnNode: {
    height: 70,
    width: 260,
  },
  // Legacy alias
  ADD_BUTTON: {
    height: 18,
    width: 18,
  },
}

// Helper function to determine if node affects bounding box
const doesNodeAffectBoundingBox = (type: ApNodeType): boolean =>
  type === ApNodeType.BIG_ADD_BUTTON ||
  type === ApNodeType.STEP ||
  type === ApNodeType.LOOP_RETURN_NODE

export const flowConstants = {
  // Arc constants
  ARC_LENGTH,
  ARC_LEFT,
  ARC_RIGHT,
  ARC_LEFT_DOWN,
  ARC_RIGHT_DOWN,
  ARC_RIGHT_UP,
  ARC_LEFT_UP,
  ARROW_DOWN,
  
  // Spacing constants
  VERTICAL_SPACE_BETWEEN_STEP_AND_LINE,
  VERTICAL_SPACE_BETWEEN_STEPS,
  VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD,
  VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD,
  LABEL_HEIGHT,
  LABEL_VERTICAL_PADDING,
  LINE_WIDTH,
  HORIZONTAL_SPACE_BETWEEN_NODES,
  
  // Node sizes
  AP_NODE_SIZE,
  
  // Helper functions
  doesNodeAffectBoundingBox,
  
  // Handle styling
  HANDLE_STYLING: { opacity: 0, cursor: 'default' },
}

// Center position for main flow
export const LAYOUT_CONFIG = {
  centerX: 130, // Center position for nodes (updated from ActivePieces analysis)
  nodeSpacing: VERTICAL_SPACE_BETWEEN_STEPS,
  branchSpacing: HORIZONTAL_SPACE_BETWEEN_NODES,
  nodeWidth: 260,
  nodeHeight: 70,
}