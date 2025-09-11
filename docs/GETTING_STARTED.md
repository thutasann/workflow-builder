# Getting Started

## Prerequisites

- Node.js 18+
- npm or yarn
- Basic knowledge of React and TypeScript

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd workflow
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## Project Structure

```
workflow/
├── src/
│   ├── components/         # React components
│   │   ├── nodes/         # Node components
│   │   ├── edges/         # Edge components
│   │   └── *.tsx          # Other components
│   ├── context/           # State management
│   ├── types/             # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── App.css            # Global styles
│   └── main.tsx           # Entry point
├── docs/                  # Documentation
├── public/                # Static assets
└── package.json           # Dependencies
```

## Basic Usage

### Creating Your First Workflow

1. **Start with a Trigger**: Every workflow begins with a trigger node (e.g., "New Message Post")

2. **Add Actions**: Click the `+` button on the edge to add action nodes

3. **Automatic Organization**: Nodes automatically align vertically with consistent spacing

### Understanding Nodes

#### Trigger Nodes

- Always the first node (step 1)
- Purple border style
- Examples: Webhooks, Scheduled events, Form submissions

#### Action Nodes

- Sequential steps (2, 3, 4...)
- Gray border style
- Examples: Send email, Create database record, Call API

### Working with the Interface

#### Canvas Controls

- **Zoom**: Mouse wheel or pinch gesture
- **Pan**: Click and drag on empty space
- **Select**: Click on nodes or edges
- **Add Node**: Click the `+` button on any edge

#### Visual Elements

- **Minimap**: Bottom-right corner for navigation
- **Controls**: Zoom in/out buttons
- **Background**: Dot pattern for visual reference

## Code Examples

### Adding a Custom Trigger Node

```typescript
import { useWorkflow } from './context/WorkflowContext'

function MyComponent() {
  const { addNode, onConnect } = useWorkflow()

  const addCustomTrigger = () => {
    // Add trigger node
    const triggerId = 'trigger-custom'
    addNode({
      id: triggerId,
      type: 'trigger',
      position: { x: 400, y: 100 },
      data: {
        label: 'Custom Trigger',
        type: 'trigger',
        stepNumber: '1',
        integrationName: 'My App',
        integrationLogo: '/path/to/logo.png',
      },
    })

    // Add placeholder for next node
    addNode({
      id: 'end-placeholder',
      type: 'action',
      position: { x: 400, y: 300 },
      data: {
        label: '',
        type: 'action',
        stepNumber: '',
      },
      style: { opacity: 0, pointerEvents: 'none' },
    })

    // Connect them
    onConnect({
      source: triggerId,
      target: 'end-placeholder',
      sourceHandle: null,
      targetHandle: null,
    })
  }

  return <button onClick={addCustomTrigger}>Add Trigger</button>
}
```

### Reading Workflow State

```typescript
import { useWorkflow } from './context/WorkflowContext'

function WorkflowInfo() {
  const { nodes, edges } = useWorkflow()

  const triggerNode = nodes.find((n) => n.type === 'trigger')
  const actionNodes = nodes.filter((n) => n.type === 'action' && n.id !== 'end-placeholder')

  return (
    <div>
      <h3>Workflow Summary</h3>
      <p>Trigger: {triggerNode?.data.label || 'None'}</p>
      <p>Actions: {actionNodes.length}</p>
      <p>Total Connections: {edges.length}</p>
    </div>
  )
}
```

### Programmatically Adding Nodes

```typescript
const { nodes, addNode, onConnect } = useWorkflow()

// Find where to insert (between two existing nodes)
const sourceNode = nodes.find((n) => n.id === 'trigger-1')
const targetNode = nodes.find((n) => n.id === 'action-1')

if (sourceNode && targetNode) {
  // Calculate position
  const newY = (sourceNode.position.y + targetNode.position.y) / 2

  // Add new node
  const newNodeId = `node_${Date.now()}`
  addNode({
    id: newNodeId,
    type: 'action',
    position: { x: 400, y: newY },
    data: {
      label: 'New Action',
      type: 'action',
      stepNumber: '2',
      integrationName: 'Custom',
    },
  })

  // Update connections
  // Remove old edge and create two new ones
  // This is handled automatically by the CustomEdge component
}
```

## Styling and Customization

### Node Styling

Nodes can be styled through the `style` prop:

```typescript
addNode({
  id: 'custom-node',
  type: 'action',
  position: { x: 400, y: 300 },
  data: {
    /* ... */
  },
  style: {
    background: '#f0f0f0',
    border: '2px solid #333',
    borderRadius: '8px',
  },
})
```

### Custom Node Types

To add a new node type:

1. Create the component in `src/components/nodes/`
2. Register it in the `nodeTypes` object
3. Use it in your workflow

## Best Practices

1. **Unique IDs**: Always use unique IDs for nodes (timestamp or UUID)
2. **Data Structure**: Keep node data consistent with the type definitions
3. **Position Management**: Let the system handle Y-positioning
4. **Edge Types**: Always use 'custom' type for edges
5. **State Updates**: Use context methods, never mutate state directly

## Troubleshooting

### Common Issues

**Nodes not appearing:**

- Check if the node ID is unique
- Verify position coordinates
- Ensure node type is registered

**Edges not connecting:**

- Confirm source and target IDs exist
- Check edge type is 'custom'
- Verify no duplicate edges

**Layout issues:**

- Nodes should have x: 400 for alignment
- Use the automatic positioning system
- Check for position conflicts

### Development Tips

- Use React DevTools to inspect component state
- Check browser console for React Flow warnings
- Use the `console.log` in WorkflowCanvas to debug node/edge arrays
- Verify TypeScript types match expected structure

## Next Steps

1. Explore the [API Reference](./API.md) for detailed method documentation
2. Review the [Architecture Guide](./ARCHITECTURE.md) for system design
3. Check example implementations in the codebase
4. Experiment with custom node types and styling
