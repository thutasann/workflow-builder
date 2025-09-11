# API Reference

## Context API

### useWorkflow Hook

The primary interface for interacting with the workflow state.

```typescript
const workflow = useWorkflow()
```

#### Properties

| Property       | Type             | Description                   |
| -------------- | ---------------- | ----------------------------- |
| `nodes`        | `WorkflowNode[]` | Array of all workflow nodes   |
| `edges`        | `WorkflowEdge[]` | Array of all connections      |
| `selectedNode` | `string \| null` | ID of currently selected node |
| `selectedEdge` | `string \| null` | ID of currently selected edge |

#### Methods

##### onNodesChange

```typescript
onNodesChange(changes: NodeChange[]): void
```

Handles node-related changes (position, selection, removal).

##### onEdgesChange

```typescript
onEdgesChange(changes: EdgeChange[]): void
```

Handles edge-related changes (selection, removal).

##### onConnect

```typescript
onConnect(connection: Connection): void
```

Creates a new edge between nodes.

**Parameters:**

- `connection.source` - Source node ID
- `connection.target` - Target node ID
- `connection.sourceHandle` - Source handle ID (optional)
- `connection.targetHandle` - Target handle ID (optional)

##### addNode

```typescript
addNode(node: WorkflowNode): void
```

Adds a new node to the workflow.

**Example:**

```typescript
addNode({
  id: 'action-1',
  type: 'action',
  position: { x: 400, y: 300 },
  data: {
    label: 'Send Email',
    type: 'action',
    stepNumber: '2',
    integrationName: 'Gmail',
  },
})
```

##### updateNode

```typescript
updateNode(nodeId: string, updates: Partial<WorkflowNode>): void
```

Updates an existing node's properties.

##### deleteNode

```typescript
deleteNode(nodeId: string): void
```

Removes a node and its connected edges.

##### setSelectedNode

```typescript
setSelectedNode(nodeId: string | null): void
```

Sets the selected node for highlighting.

##### setSelectedEdge

```typescript
setSelectedEdge(edgeId: string | null): void
```

Sets the selected edge for highlighting.

##### clearWorkflow

```typescript
clearWorkflow(): void
```

Removes all nodes and edges.

## Component Props

### TriggerNode

```typescript
interface CustomNodeProps {
  id: string
  data: WorkflowNodeData
  selected: boolean
  type: string
  dragging: boolean
  zIndex: number
  isConnectable: boolean
  position: XYPosition
  // ... other ReactFlow NodeProps
}
```

### ActionNode

Same as TriggerNode props.

### CustomEdge

```typescript
interface EdgeProps {
  id: string
  source: string
  target: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  markerEnd?: string
  // ... other ReactFlow EdgeProps
}
```

## Type Definitions

### WorkflowNode

```typescript
type WorkflowNode = Node<WorkflowNodeData, NodeType>

interface WorkflowNodeData {
  label: string // Display text
  type: NodeType // Node variant
  icon?: string // Icon identifier
  description?: string // Tooltip/description
  config?: Record<string, any> // Node-specific config
  integrationLogo?: string // Logo URL
  integrationName?: string // Integration display name
  stepNumber?: string // Step sequence number
  [key: string]: any // Additional properties
}
```

### WorkflowEdge

```typescript
type WorkflowEdge = Edge<{
  label?: string // Edge label
  condition?: any // Conditional logic
}>
```

### NodeType

```typescript
type NodeType = 'trigger' | 'action' | 'router' | 'branch'
```

## Event Handlers

### Node Events

```typescript
onNodeClick?: (event: React.MouseEvent, node: Node) => void
onNodeDoubleClick?: (event: React.MouseEvent, node: Node) => void
onNodeMouseEnter?: (event: React.MouseEvent, node: Node) => void
onNodeMouseLeave?: (event: React.MouseEvent, node: Node) => void
```

### Edge Events

```typescript
onEdgeClick?: (event: React.MouseEvent, edge: Edge) => void
onEdgeDoubleClick?: (event: React.MouseEvent, edge: Edge) => void
```

### Canvas Events

```typescript
onPaneClick?: (event: React.MouseEvent) => void
onPaneScroll?: (event: React.WheelEvent) => void
onPaneContextMenu?: (event: React.MouseEvent) => void
```

## Utility Functions

### Node Creation Helpers

```typescript
// Generate unique node ID
const generateNodeId = (): string => {
  return `node_${Date.now()}`
}

// Create trigger node
const createTriggerNode = (position: XYPosition, data: Partial<WorkflowNodeData>): WorkflowNode => {
  return {
    id: generateNodeId(),
    type: 'trigger',
    position,
    data: {
      type: 'trigger',
      stepNumber: '1',
      ...data,
    },
  }
}

// Create action node
const createActionNode = (position: XYPosition, data: Partial<WorkflowNodeData>): WorkflowNode => {
  return {
    id: generateNodeId(),
    type: 'action',
    position,
    data: {
      type: 'action',
      ...data,
    },
  }
}
```

### Position Calculations

```typescript
// Calculate node position in vertical layout
const calculateNodePosition = (index: number, startY: number = 100, spacing: number = 200): XYPosition => {
  return {
    x: 400, // Fixed X coordinate
    y: startY + index * spacing,
  }
}

// Get middle position between two nodes
const getMiddlePosition = (node1: Node, node2: Node): XYPosition => {
  return {
    x: (node1.position.x + node2.position.x) / 2,
    y: (node1.position.y + node2.position.y) / 2,
  }
}
```

## Constants

```typescript
// Layout constants
export const LAYOUT = {
  NODE_WIDTH: 350,
  NODE_HEIGHT: 85,
  NODE_SPACING: 200,
  CENTER_X: 400,
  START_Y: 100,
}

// Style constants
export const STYLES = {
  TRIGGER_COLOR: '#6366f1',
  ACTION_COLOR: '#9ca3af',
  EDGE_COLOR: '#9ca3af',
  SELECTED_COLOR: '#6366f1',
  BACKGROUND_COLOR: '#fafafa',
}
```
