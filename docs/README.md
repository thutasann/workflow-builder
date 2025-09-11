# Workflow Builder Documentation

A React-based visual workflow builder inspired by ActivePieces, built with React Flow (xyflow).

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Components](#components)
- [Usage](#usage)
- [API Reference](#api-reference)

## Overview

This workflow builder allows users to create visual automation workflows with a drag-and-drop interface. It features:

- **Trigger nodes** - Starting points for workflows (e.g., Slack messages, webhooks)
- **Action nodes** - Operations to perform (e.g., create database items, send notifications)
- **Visual connections** - Straight-line edges with inline controls
- **Non-draggable nodes** - Fixed vertical layout for clean organization
- **Dynamic node insertion** - Add nodes between existing ones with plus buttons

## Architecture

The project follows a component-based architecture with global state management:

```
src/
├── components/
│   ├── nodes/
│   │   ├── TriggerNode.tsx    # Trigger node component
│   │   └── ActionNode.tsx     # Action node component
│   ├── edges/
│   │   └── CustomEdge.tsx     # Custom edge with plus button
│   ├── WorkflowCanvas.tsx     # Main canvas component
│   └── WorkflowHeader.tsx     # Header with workflow name
├── context/
│   └── WorkflowContext.tsx    # Global state management
├── types/
│   └── workflow.types.ts      # TypeScript definitions
└── App.tsx                    # Main application component
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Key Dependencies

- `@xyflow/react` - React Flow library for workflow visualization
- `react` - UI framework
- `typescript` - Type safety
- `vite` - Build tool

## Components

### Node Components

#### TriggerNode

The starting point of any workflow. Features:

- Step number "1"
- Integration logo and name
- Bottom handle for connections
- Purple accent color

#### ActionNode

Represents workflow actions. Features:

- Sequential step numbering (2, 3, 4...)
- Integration logo and name
- Top and bottom handles
- Gray styling

### Edge Component

#### CustomEdge

Straight-line connections between nodes with:

- Plus button for inserting new nodes
- Custom styling with gray color scheme
- Automatic edge type assignment

### Canvas Component

#### WorkflowCanvas

Main container that:

- Renders nodes and edges
- Handles user interactions
- Provides zoom/pan controls
- Shows minimap
- Dot-pattern background

## Usage

### Basic Workflow Creation

1. **Initial State**: The workflow starts with a trigger node
2. **Add Actions**: Click the plus button on edges to insert action nodes
3. **Automatic Layout**: Nodes maintain 200px vertical spacing
4. **Step Numbering**: Automatically updates as nodes are added

### Context API

The `WorkflowContext` provides global state management:

```typescript
const {
  nodes, // Current nodes array
  edges, // Current edges array
  addNode, // Add a new node
  onConnect, // Connect two nodes
  deleteNode, // Remove a node
  updateNode, // Update node data
  // ... other methods
} = useWorkflow()
```

### Node Structure

```typescript
interface WorkflowNode {
  id: string
  type: 'trigger' | 'action'
  position: { x: number; y: number }
  data: {
    label: string
    type: NodeType
    stepNumber?: string
    integrationName?: string
    integrationLogo?: string
  }
}
```

## Features

### Phase 1 (Completed) ✓

- [x] React Flow integration
- [x] Custom node components (Trigger, Action)
- [x] Custom edge with plus button
- [x] Non-draggable nodes
- [x] Vertical alignment (400px center)
- [x] 200px spacing between nodes
- [x] Step numbering system
- [x] Duplicate prevention
- [x] TypeScript support

### Future Phases

- [ ] Node palette/sidebar
- [ ] Drag and drop from palette
- [ ] Connection validation
- [ ] Node configuration panels
- [ ] Workflow execution
- [ ] Import/Export functionality
- [ ] Undo/Redo system
- [ ] Keyboard shortcuts

## Best Practices

1. **State Management**: Use the context API for all workflow modifications
2. **Node IDs**: Generate unique IDs using timestamps or UUIDs
3. **Edge Types**: Always use 'custom' type for consistent styling
4. **Positioning**: Maintain the 400px X-coordinate for vertical alignment
5. **Spacing**: Keep 200px between nodes for readability

## Troubleshooting

### Common Issues

1. **Duplicate Nodes**: The context prevents duplicates by checking IDs
2. **Missing Plus Buttons**: Ensure edges use type: 'custom'
3. **Node Ordering**: Nodes are automatically sorted by Y position
4. **Step Numbers**: Recalculated on every node addition

### Development Tips

- Use the browser console to inspect node/edge arrays
- Check React DevTools for context state
- Verify edge connections in the edges array
- Monitor node positions for alignment issues
