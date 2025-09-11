# Architecture Guide

## Overview

The workflow builder follows a unidirectional data flow architecture with centralized state management through React Context API.

## Core Concepts

### 1. State Management

The application state is managed through `WorkflowContext`, which maintains:

```typescript
interface WorkflowState {
  nodes: WorkflowNode[] // All workflow nodes
  edges: WorkflowEdge[] // Connections between nodes
  selectedNode: string | null // Currently selected node ID
  selectedEdge: string | null // Currently selected edge ID
}
```

### 2. Component Hierarchy

```
App
└── WorkflowProvider (Context)
    └── WorkflowBuilder
        └── ReactFlowProvider
            └── WorkflowCanvas
                ├── WorkflowHeader
                ├── ReactFlow
                │   ├── TriggerNode(s)
                │   ├── ActionNode(s)
                │   └── CustomEdge(s)
                ├── Controls
                ├── MiniMap
                └── Background
```

### 3. Data Flow

1. **User Interaction** → Component Event Handler
2. **Event Handler** → Context Method Call
3. **Context Method** → State Update
4. **State Update** → Component Re-render
5. **Re-render** → UI Update

## Key Design Decisions

### Non-Draggable Nodes

Nodes are intentionally non-draggable to maintain a clean, organized layout:

- Fixed X-coordinate (400px)
- Automatic Y-positioning with 200px spacing
- Ensures consistent visual hierarchy

### Custom Edge Implementation

Custom edges provide:

- Inline node insertion via plus buttons
- Straight-line connections for clarity
- Consistent styling across the workflow

### Node Positioning Algorithm

```typescript
// Pseudo-code for node positioning
1. Add new node to array
2. Sort all nodes by current Y position
3. Starting from trigger node Y position:
   - Position each node at currentY
   - Increment currentY by 200px
   - Update step numbers sequentially
```

### Duplicate Prevention

The system prevents duplicates at multiple levels:

- Node IDs are checked before addition
- Edge connections verify uniqueness
- React StrictMode compatibility

## Type System

### Core Types

```typescript
// Node type variants
type NodeType = 'trigger' | 'action' | 'router' | 'branch'

// Node data structure
interface WorkflowNodeData {
  label: string
  type: NodeType
  stepNumber?: string
  integrationName?: string
  integrationLogo?: string
  [key: string]: any // Extensibility
}

// Full node type
type WorkflowNode = Node<WorkflowNodeData, NodeType>

// Edge type with optional data
type WorkflowEdge = Edge<{
  label?: string
  condition?: any
}>
```

## Performance Considerations

### Optimization Strategies

1. **Component Memoization**

   - Node types defined outside components
   - Prevent unnecessary re-renders

2. **Batch Updates**

   - State updates grouped when possible
   - Single re-render for multiple changes

3. **Efficient Sorting**
   - Nodes sorted only when necessary
   - O(n log n) complexity for positioning

## Extension Points

### Adding New Node Types

1. Define the type in `workflow.types.ts`
2. Create component in `components/nodes/`
3. Register in `nodeTypes` object
4. Update positioning logic if needed

### Custom Validations

Hook into the context methods:

```typescript
// Example: Connection validation
onConnect: (connection) => {
  if (isValidConnection(connection)) {
    // Proceed with connection
  }
}
```

### Workflow Persistence

Add save/load functionality:

```typescript
// Serialize workflow
const saveWorkflow = () => {
  return JSON.stringify({
    nodes: nodes,
    edges: edges,
    metadata: { version: '1.0' },
  })
}

// Deserialize workflow
const loadWorkflow = (json: string) => {
  const data = JSON.parse(json)
  // Validate and load nodes/edges
}
```

## Security Considerations

1. **Input Validation**

   - Sanitize node labels and data
   - Validate integration URLs

2. **ID Generation**

   - Use cryptographically secure methods for production
   - Avoid predictable patterns

3. **Data Isolation**
   - Context provider creates isolated scope
   - No global state pollution

## Testing Strategy

### Unit Tests

- Individual component behavior
- Context method logic
- Type safety verification

### Integration Tests

- Node addition/removal flows
- Edge connection scenarios
- State consistency checks

### E2E Tests

- Complete workflow creation
- User interaction sequences
- Visual regression tests
