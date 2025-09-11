# ActivePieces Workflow Builder Analysis

## Overview
This document contains key insights from analyzing the ActivePieces workflow builder implementation. These findings should guide our workflow builder development to match their sophisticated design patterns.

## 1. Graph-Based Layout Architecture

### Core Layout System
- **Recursive Graph Building**: The `buildGraph` function recursively processes steps to create nodes and edges
- **Graph Structure**: Each step generates its own subgraph with nodes and edges
- **Merging**: Child graphs are merged with parent graphs using `mergeGraph` function
- **Offset Calculation**: Uses `offsetGraph` to position child elements relative to parents

### Key Functions
```typescript
// Main graph building function
buildGraph(step: FlowAction | FlowTrigger): ApGraph

// Offset graph by x,y coordinates
offsetGraph(graph: ApGraph, offset: { x: number; y: number }): ApGraph

// Merge two graphs together
mergeGraph(graph1: ApGraph, graph2: ApGraph): ApGraph

// Calculate graph bounding box
calculateGraphBoundingBox(graph: ApGraph): BoundingBox
```

## 2. Layout Constants and Dimensions

### Node Sizes
```typescript
AP_NODE_SIZE = {
  STEP: { width: 260, height: 70 },
  BIG_ADD_BUTTON: { width: 50, height: 50 },
  ADD_BUTTON: { width: 18, height: 18 },
  LOOP_RETURN_NODE: { width: 260, height: 70 }
}
```

### Spacing Constants
```typescript
HORIZONTAL_SPACE_BETWEEN_NODES = 80  // Space between branches
VERTICAL_SPACE_BETWEEN_STEPS = 85    // Space between sequential steps
ARC_LENGTH = 15                      // Radius for curved edges
LINE_WIDTH = 1.5                     // Edge stroke width
LABEL_HEIGHT = 30                    // Branch label height
LABEL_VERTICAL_PADDING = 12          // Padding for labels
```

### Vertical Offsets
```typescript
VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD = VERTICAL_SPACE_BETWEEN_STEPS * 1.5 + 2 * ARC_LENGTH
VERTICAL_OFFSET_BETWEEN_ROUTER_AND_CHILD = VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD + LABEL_HEIGHT
```

## 3. Branch Positioning Algorithm

### The `offsetRouterChildSteps` Function
This is the core algorithm for positioning branches horizontally:

```typescript
const offsetRouterChildSteps = (childGraphs: ApGraph[]) => {
  // 1. Calculate bounding boxes for all child graphs
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

## 4. Edge Types and Routing

### Edge Type Enumeration
```typescript
enum ApEdgeType {
  STRAIGHT_LINE = 'straightLineEdge',
  LOOP_START_EDGE = 'loopStartLineEdge',
  LOOP_RETURN_EDGE = 'loopReturnLineEdge',
  ROUTER_START_EDGE = 'routerStartEdge',
  ROUTER_END_EDGE = 'routerEndEdge'
}
```

### Router Start Edge Implementation
- Draws from router node to branch start
- Includes branch label as foreignObject
- Uses SVG path with arcs for smooth curves
- Conditional rendering based on branch emptiness

### Router End Edge Implementation
- Converges branches back to main flow
- Calculates vertical spacing dynamically
- Draws horizontal lines for first and last branches

## 5. Branch Operations

### Operation Types
```typescript
FlowOperationType.ADD_BRANCH
FlowOperationType.DELETE_BRANCH
FlowOperationType.DUPLICATE_BRANCH
FlowOperationType.MOVE_BRANCH
```

### Branch Data Structure
```typescript
interface RouterAction {
  type: FlowActionType.ROUTER
  settings: {
    branches: Array<{
      branchName: string
      branchType: BranchExecutionType
      conditions?: BranchCondition[][]
    }>
  }
  children: (FlowAction | undefined)[]
}
```

## 6. State Management Patterns

### Zustand Store Structure
- **Flow Version**: Current flow state
- **Operations**: Queued operations with promises
- **Selected Step**: Current selection state
- **Apply Operation**: Central function for all flow modifications

### Operation Flow
1. User triggers action
2. Operation created with type and payload
3. Optimistic UI update
4. Operation queued for server sync
5. Server response updates final state

## 7. Component Architecture

### Node Components
- `ApStepCanvasNode`: Main step component with drag support
- `ApBigAddButtonCanvasNode`: Large add button for empty branches
- `ApLoopReturnCanvasNode`: Special node for loop returns
- `ApGraphEndWidgetNode`: Invisible node for graph termination

### Edge Components
- `ApStraightLineCanvasEdge`: Simple vertical connections
- `ApRouterStartCanvasEdge`: Router to branch connections
- `ApRouterEndCanvasEdge`: Branch to merge point connections
- `BranchLabel`: Interactive label component within edges

## 8. Key Implementation Patterns

### Graph Building for Routers
```typescript
const buildRouterChildGraph = (step: RouterAction) => {
  // 1. Build child graphs for each branch
  const childGraphs = step.children.map((branch, index) => {
    return branch ? buildGraph(branch) : createBigAddButtonGraph(step, {...})
  })
  
  // 2. Apply horizontal offset algorithm
  const childGraphsAfterOffset = offsetRouterChildSteps(childGraphs)
  
  // 3. Create end node for convergence
  const subgraphEndNode = createGraphEndNode(...)
  
  // 4. Create start and end edges for each branch
  const edges = createRouterEdges(childGraphsAfterOffset)
  
  // 5. Return merged graph
  return mergeGraphs(nodes, edges)
}
```

### Empty Branch Handling
- Empty branches show a BigAddButton node
- Button data includes parent step and branch index
- Clicking creates new action at specific location

## 9. Visual Design Patterns

### Branch Labels
- Positioned as foreignObjects in SVG
- Interactive with hover states
- Context menu for operations
- "Otherwise" branch is specially labeled

### Node Styling
- Border changes on hover and selection
- Skipped nodes have accent background
- Dragging nodes become transparent
- Step numbers shown automatically

## 10. Performance Optimizations

### React Flow Optimizations
- Custom node/edge types registered once
- Memoized components with React.memo
- Selective re-renders based on step changes
- FitView with custom parameters for focus

### Graph Calculation Caching
- Bounding boxes calculated once per layout
- Graph structure cached until changes
- Offset calculations done in batches

## Key Differences from Our Implementation

1. **Node Size**: AP uses 260x70px vs our 350x80px
2. **Branch Spacing**: AP uses 80px vs our 180px
3. **Architecture**: AP uses graph-based vs our direct positioning
4. **Branch Labels**: AP uses edge components vs our separate nodes
5. **State Management**: AP uses Zustand vs our Context API

## Recommendations for Our Implementation

1. **Adopt Graph-Based Architecture**: More flexible and maintainable
2. **Reduce Branch Spacing**: 80px provides better visual density
3. **Use Recursive Graph Building**: Easier to handle nested structures
4. **Implement Operation Queue**: Better state management
5. **Add Arc-Based Edge Routing**: Smoother visual appearance
6. **Consider Zustand**: More performant than Context API
7. **Add Empty Branch Buttons**: Better UX for adding actions
8. **Implement Bounding Box Calculations**: Precise layout control

## Code References

- Layout Algorithm: `/activepieces/packages/react-ui/src/app/builder/flow-canvas/utils/flow-canvas-utils.ts`
- Constants: `/activepieces/packages/react-ui/src/app/builder/flow-canvas/utils/consts.ts`
- Router Edges: `/activepieces/packages/react-ui/src/app/builder/flow-canvas/edges/router-start-edge.tsx`
- Branch Labels: `/activepieces/packages/react-ui/src/app/builder/flow-canvas/edges/branch-label.tsx`
- Step Node: `/activepieces/packages/react-ui/src/app/builder/flow-canvas/nodes/step-node.tsx`