# Router/Branches Implementation Guide

This document explains how we implemented the router (conditional branches) feature following ActivePieces' architecture.

## Overview

The router feature allows workflows to have conditional branches that execute different paths based on conditions. Our implementation follows ActivePieces' graph-based architecture exactly.

## Architecture

### 1. Data Structure

```typescript
// Router action type with branches
interface RouterAction extends FlowAction {
  type: FlowActionType.ROUTER
  settings: {
    branches: Array<{
      branchName: string
      branchType: BranchExecutionType // 'CONDITION' or 'FALLBACK'
      conditions?: any[][]
    }>
  }
  children: (FlowAction | undefined)[] // Array of branch contents
}
```

### 2. Graph Building Process

The router implementation uses a recursive graph-building approach:

```typescript
// Main graph building function
buildGraph(step) {
  // 1. Create step node
  const graph = createStepGraph(step)
  
  // 2. Build child graph for routers
  if (step.type === FlowActionType.ROUTER) {
    const childGraph = buildRouterChildGraph(step)
    graph = mergeGraph(graph, childGraph)
  }
  
  // 3. Build next step graph
  const nextStepGraph = buildGraph(step.nextAction)
  
  // 4. Merge and return
  return mergeGraph(graph, offsetGraph(nextStepGraph))
}
```

## Key Components

### 1. Router Node Creation

When creating a router through the UI:

```typescript
// StepSelectorHandler.tsx
if (actionType === FlowActionType.ROUTER) {
  newAction = {
    name: `step-${Date.now()}`,
    displayName: 'Router',
    type: FlowActionType.ROUTER,
    settings: {
      branches: [
        { branchName: 'Branch 1', branchType: BranchExecutionType.CONDITION }
      ]
    },
    children: [undefined, undefined] // 1 condition + 1 "Otherwise" branch
  }
}
```

### 2. Branch Layout Algorithm

The branches are positioned using ActivePieces' centering algorithm:

```typescript
// offsetRouterChildSteps function
const offsetRouterChildSteps = (childGraphs: ApGraph[]): ApGraph[] => {
  // 1. Calculate bounding boxes for all branches
  const childGraphsBoundingBoxes = childGraphs.map(calculateGraphBoundingBox)
  
  // 2. Calculate total width including spacing
  const totalWidth = 
    childGraphsBoundingBoxes.reduce((acc, current) => acc + current.width, 0) +
    HORIZONTAL_SPACE_BETWEEN_NODES * (childGraphs.length - 1)
  
  // 3. Center branches relative to parent
  let deltaLeftX = -(totalWidth - first.left - last.right) / 2 - first.left
  
  // 4. Position each branch
  return childGraphsBoundingBoxes.map((box, index) => {
    const x = deltaLeftX + box.left
    deltaLeftX += box.width + HORIZONTAL_SPACE_BETWEEN_NODES
    return offsetGraph(childGraphs[index], { x, y: verticalOffset })
  })
}
```

### 3. Edge Components

#### Router Start Edge (ApRouterStartEdge)
- Draws curved paths from router to each branch
- Includes branch labels (Branch 1, Otherwise)
- Handles empty branches with proper styling

```typescript
// Path generation for router start edge
const generatePath = () => {
  // Start from target position
  let path = `M ${targetX} ${targetY - VERTICAL_SPACE_BETWEEN_STEP_AND_LINE}`
  
  // Add arrow if branch is not empty
  if (!routerData.isBranchEmpty) {
    path += ARROW_DOWN
  }
  
  // Vertical line up
  path += `v -${verticalLineLength}`
  
  // Add curves based on position
  if (distanceBetweenSourceAndTarget >= ARC_LENGTH) {
    path += sourceX > targetX ? ' a12,12 0 0,1 12,-12' : ' a-12,-12 0 0,0 -12,-12'
    // ... additional path logic
  }
  
  return path
}
```

#### Router End Edge (ApRouterEndEdge)
- Merges branches back to main flow
- Draws curved paths from branch ends to merge point
- Includes add button for adding steps after router

### 4. Branch Labels

Branch labels are embedded within the router start edges as foreignObject elements:

```typescript
<foreignObject
  width={AP_NODE_SIZE.step.width - 10 + 'px'}
  height={LABEL_HEIGHT + LABEL_VERTICAL_PADDING + 'px'}
  x={targetX - (AP_NODE_SIZE.step.width - 10) / 2}
  y={targetY - verticalLineLength / 2 - 40}
>
  <BranchLabel
    label={routerData.label}
    sourceNodeName={source}
    targetNodeName={target}
    stepLocationRelativeToParent={routerData.stepLocationRelativeToParent}
    branchIndex={routerData.branchIndex}
  />
</foreignObject>
```

## Layout Constants

Key spacing constants from ActivePieces:

```typescript
const HORIZONTAL_SPACE_BETWEEN_NODES = 80 // Space between branches
const VERTICAL_SPACE_BETWEEN_STEPS = 85   // Space between sequential steps
const ARC_LENGTH = 15                     // Radius for curved edges
const LABEL_HEIGHT = 30                   // Branch label height
const VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD = 
  VERTICAL_SPACE_BETWEEN_STEPS * 1.5 + 2 * ARC_LENGTH + LABEL_HEIGHT
```

## Edge Drawing Rules

### For Router Start Edges:
- `drawStartingVerticalLine`: Only for first branch (index 0)
- `drawHorizontalLine`: Only for first and last branches
- Branch labels: "Branch 1" for first, "Otherwise" for last

### For Router End Edges:
- `drawEndingVerticalLine`: Only for first branch
- `drawHorizontalLine`: Only for first and last branches
- Vertical spacing calculated dynamically based on content

## Empty Branch Handling

Empty branches show a big add button:

```typescript
const createBigAddButtonGraph = (parentStep, nodeData) => {
  const bigAddButtonNode = {
    type: ApNodeType.BIG_ADD_BUTTON,
    position: { 
      x: (AP_NODE_SIZE.step.width - AP_NODE_SIZE.bigAddButton.width) / 2,
      y: 0 
    }
  }
  // ... rest of graph creation
}
```

## Styling

### CSS Variables
```css
.react-flow {
  --xy-edge-stroke-default: #b1b1b7 !important;
  --xy-edge-stroke-selected-default: #b1b1b7 !important;
}

.react-flow__edge.selectable > path {
  pointer-events: none !important;
}
```

### Edge Styling
- Stroke width: 1.5px
- Stroke color: #b1b1b7 (light gray)
- No fill, just stroke

## Usage Example

To add a router to your workflow:

1. Click the + button between steps
2. Select "Router" from the step selector
3. The router is created with 2 branches by default:
   - Branch 1 (conditional)
   - Otherwise (fallback)
4. Click the + buttons in each branch to add steps
5. Configure branch conditions in the settings panel

## Key Files

- `/src/utils/graphUtils.ts` - Main graph building logic
- `/src/components/edges/ApRouterStartEdge.tsx` - Router to branch edges
- `/src/components/edges/ApRouterEndEdge.tsx` - Branch to merge point edges
- `/src/components/StepSelectorHandler.tsx` - Router creation logic
- `/src/types/workflow.types.ts` - TypeScript interfaces

## ActivePieces Compatibility

This implementation exactly matches ActivePieces' router system:
- Same graph-based architecture
- Same positioning algorithms
- Same edge drawing patterns
- Same visual appearance
- Same interaction patterns

The only difference is we start with 2 branches (Branch 1 + Otherwise) while ActivePieces can have more branches that can be added/removed dynamically.