# Workflow Builder Documentation

A React-based visual workflow builder inspired by ActivePieces, built with React Flow (@xyflow/react) using a graph-based architecture.

## Table of Contents

- [Overview](#overview)
- [ActivePieces Architecture](#activepieces-architecture)
- [Key Concepts](#key-concepts)
- [Components](#components)
- [Graph System](#graph-system)
- [API Reference](#api-reference)
- [Implementation Guide](#implementation-guide)

## Overview

This workflow builder implements ActivePieces' graph-based architecture for creating visual automation workflows. Key features:

- **Graph-Based State** - Workflows represented as FlowVersion with recursive structure
- **ActivePieces Node Types** - ApStepNode, ApBigAddButtonNode, ApGraphEndNode
- **Straight-Line Edges** - All connections use ApStraightLineEdge with inline controls
- **Automatic Layout** - Graph building with proper offsets and spacing
- **Step Selector Popup** - Beautiful UI for adding integrations and actions
- **Router Support** - Create branching workflows with conditional logic

## ActivePieces Architecture

The project follows ActivePieces' graph-based architecture:

```
src/
├── components/
│   ├── nodes/
│   │   ├── ApStepNode.tsx        # Main step component for triggers/actions
│   │   ├── ApBigAddButtonNode.tsx # Large button for empty branches
│   │   └── ApGraphEndNode.tsx    # Graph termination widget
│   ├── edges/
│   │   └── ApStraightLineEdge.tsx # Straight edges with add buttons
│   ├── WorkflowCanvas.tsx        # React Flow canvas
│   ├── StepSelector.tsx          # Integration selector popup
│   └── StepSelectorHandler.tsx   # Step selector logic
├── context/
│   └── WorkflowContext.tsx       # Graph-based state management
├── types/
│   └── workflow.types.ts         # ActivePieces-style types
├── utils/
│   ├── graphUtils.ts             # Graph building functions
│   ├── reactFlowConverter.ts     # ApGraph to React Flow
│   └── flowConstants.ts          # Dimensions and constants
└── App.tsx                       # Main application
```

## Key Concepts

### FlowVersion Structure
```typescript
interface FlowVersion {
  displayName: string
  trigger: FlowTrigger
  valid: boolean
  updated: string
}
```

### ApGraph System
```typescript
interface ApGraph {
  nodes: ApNode[]
  edges: ApEdge[]
}
```

### Flow Action Types
```typescript
enum FlowActionType {
  CODE = 'CODE',
  PIECE = 'PIECE',
  LOOP_ON_ITEMS = 'LOOP_ON_ITEMS',
  ROUTER = 'ROUTER'
}
```

## Components

### Node Components

#### ApStepNode
The main workflow step component (260x70px):
- Renders both triggers and actions
- Shows icon, title, and subtitle
- Dropdown menu for step options
- Handles for edge connections

#### ApBigAddButtonNode
Large add button for empty branches:
- Used in router branches
- Centered plus icon
- Opens step selector on click

#### ApGraphEndNode
Graph termination point:
- Usually invisible (0x0 size)
- Shows flag icon when `showWidget` is true
- Used for layout calculations

### Edge Component

#### ApStraightLineEdge
Straight-line connections with:
- Inline plus button at midpoint
- Uses React Flow's getStraightPath
- Opens step selector popup on click
- Configurable button visibility

### Step Selector

#### StepSelector & StepSelectorHandler
- Modal popup for choosing actions
- Categorized tabs (Explore/Apps/Utility)
- Search functionality
- Maps selections to FlowActionType

## Graph System

### Building Process

The graph is built recursively using `buildGraph()`:

```typescript
function buildGraph(step: FlowAction | FlowTrigger): ApGraph {
  // 1. Create step graph
  const graph = createStepGraph(step, height)
  
  // 2. Build child graphs (for routers/loops)
  const childGraph = buildRouterChildGraph(step)
  
  // 3. Build next step graph
  const nextGraph = buildGraph(step.nextAction)
  
  // 4. Merge with proper offsets
  return mergeGraph(graph, offsetGraph(nextGraph, offset))
}
```

### Graph Utilities

- **offsetGraph()** - Adjust node/edge positions
- **mergeGraph()** - Combine multiple graphs
- **calculateGraphBoundingBox()** - Get graph dimensions
- **convertFlowVersionToGraph()** - Main entry point

### Router Implementation

Routers create 4 branches automatically:
```typescript
const routerAction: RouterAction = {
  type: FlowActionType.ROUTER,
  children: [
    branch1Action, // Conditional branch 1
    branch2Action, // Conditional branch 2
    branch3Action, // Conditional branch 3
    null          // Otherwise branch
  ]
}
```

## API Reference

### WorkflowContext

```typescript
interface WorkflowContextType {
  // State
  flowVersion: FlowVersion
  graph: ApGraph
  selectedStep: string | null
  
  // Operations
  addAction(parentStepName: string, action: FlowAction): void
  addTrigger(trigger: FlowTrigger): void
  updateStep(stepName: string, updates: Partial<FlowAction | FlowTrigger>): void
  deleteStep(stepName: string): void
  selectStep(stepName: string | null): void
  
  // UI Controls
  openStepSelectorForStep(parentStepName: string, position: { x: number; y: number }): void
  closeStepSelector(): void
}
```

### Adding Actions

```typescript
const newAction: FlowAction = {
  name: `step-${Date.now()}`,
  displayName: 'Send Email',
  type: FlowActionType.PIECE,
  settings: {
    pieceName: 'gmail',
    actionName: 'send-email'
  },
  nextAction: undefined
}

addAction('trigger', newAction) // Add after trigger
```

## Implementation Guide

### Creating a Router

```typescript
const routerAction = {
  name: 'router-1',
  displayName: 'Branch on Condition',
  type: FlowActionType.ROUTER,
  settings: {
    branches: [
      { condition: 'value > 10' },
      { condition: 'value < 5' },
      { condition: 'value == 7' }
    ]
  },
  children: [null, null, null, null]
}
```

### Best Practices

1. **Always use context methods** for state changes
2. **Let the graph rebuild automatically** after changes
3. **Use proper TypeScript enums** for type safety
4. **Follow ActivePieces patterns** for consistency

### Troubleshooting

- **Edges not straight?** Check edge type is 'straightLine'
- **Graph not updating?** Ensure using context methods
- **Position issues?** Verify graph offset calculations
- **Missing nodes?** Check graph building recursion

## Links

- [ActivePieces Analysis](./activepieces-analysis.md)
- [Main README](../README.md)
- [Screenshots](./screenshots/)
