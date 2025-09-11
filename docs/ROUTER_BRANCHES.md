# Router Branches Architecture

## Overview

The Router node enables workflows to split into multiple parallel branches, each executing different logic based on conditions. This document outlines the architecture and implementation approach for router branches in our workflow builder.

## Core Concepts

### 1. Router Node

The Router node acts as a decision point that splits the workflow into multiple branches:

- **Input**: Single connection from the previous node
- **Outputs**: Multiple connections (3 branches by default)
- **Branch Labels**: Each branch can have a condition label (e.g., "If status = active", "If amount > 100", "Otherwise")

### 2. Branch Structure

```
                    [Trigger]
                        |
                    [Action 1]
                        |
                    [Router]
                   /    |    \
            Branch1  Branch2  Branch3
                /       |        \
          [Action]  [Action]   [Action]
              |         |          |
          [Action]  [Action]   [Action]
              |         |          |
              \         |         /
               \        |        /
                \       |       /
                 [End Connector]
                        |
                    [Action N]
```

### 3. Layout Algorithm

#### Horizontal Spacing
- Branches spread horizontally from the router
- Each branch gets equal horizontal space
- Spacing formula: `branchWidth = totalWidth / numberOfBranches`
- Branch X positions: 
  - Branch 1: `routerX - branchSpacing`
  - Branch 2: `routerX` (center)
  - Branch 3: `routerX + branchSpacing`

#### Vertical Spacing
- Maintains consistent 200px vertical spacing within each branch
- All branches start at the same Y level below the router

#### Node Positioning Rules
1. Router stays at center X (400px)
2. Branch nodes align vertically within their branch column
3. End connector aligns with router X position
4. Post-branch nodes return to center alignment

### 4. Edge Management

#### Branch Edges
- Each router output handle connects to its branch
- Branch edges maintain straight vertical lines within the branch
- Custom edge type for branch connections with condition labels

#### Merge Edges
- Branches converge at an "End Connector" node
- Diagonal edges from branch ends to merger
- Single edge continues from merger

### 5. Data Flow

```typescript
interface BranchData {
  branchId: string;          // Unique branch identifier
  condition?: string;        // Branch condition expression
  parentRouterId: string;    // Router node that created this branch
  branchIndex: number;       // 0, 1, 2 for branch position
}

interface RouterNodeData extends WorkflowNodeData {
  branches: {
    id: string;
    label: string;
    condition?: any;
  }[];
}

interface NodePosition {
  nodeId: string;
  branchId?: string;        // Which branch this node belongs to
  position: XYPosition;
  level: number;            // Vertical level in the branch
}
```

### 6. Branch Operations

#### Adding Nodes to Branches
1. Click plus button on a branch edge
2. Determine which branch based on edge source handle
3. Position new node within branch column
4. Update all downstream nodes in that branch

#### Creating End Connector
- Automatically created when first branch is populated
- Special node type that accepts multiple inputs
- Single output to continue main flow

#### Branch Deletion
- Remove all nodes in a branch
- Rebalance remaining branches
- Update edge connections

### 7. Visual Design

#### Router Node
- Wider than regular nodes (400px)
- Shows branch count indicator
- Multiple bottom handles with labels

#### Branch Edges
- Thinner than main flow edges
- Different color per branch (optional)
- Condition labels displayed on hover

#### End Connector
- Diamond or circle shape
- Shows merge indicator
- Multiple input handles, single output

### 8. Implementation Phases

#### Phase 1: Basic Branching
- Router creates 3 fixed branches
- Nodes can be added to each branch
- Simple vertical layout within branches

#### Phase 2: Branch Management
- Add/remove branches dynamically
- Conditional labels on branches
- Branch collapse/expand

#### Phase 3: Advanced Features
- Nested routers (router within branch)
- Branch templates
- Auto-layout optimization

### 9. State Management

```typescript
interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  branches: Map<string, BranchData>;
  nodePositions: Map<string, NodePosition>;
}
```

### 10. Layout Calculations

```typescript
// Calculate branch X positions
const calculateBranchPositions = (
  routerX: number,
  branchCount: number,
  branchSpacing: number = 250
): number[] => {
  const positions: number[] = [];
  const totalWidth = branchSpacing * (branchCount - 1);
  const startX = routerX - totalWidth / 2;
  
  for (let i = 0; i < branchCount; i++) {
    positions.push(startX + i * branchSpacing);
  }
  
  return positions;
};

// Position nodes within a branch
const positionBranchNodes = (
  nodes: WorkflowNode[],
  branchX: number,
  startY: number,
  nodeSpacing: number = 200
): WorkflowNode[] => {
  let currentY = startY;
  
  return nodes.map(node => ({
    ...node,
    position: {
      x: branchX,
      y: currentY += nodeSpacing
    }
  }));
};
```

## API Changes

### New Node Types
- `router`: Decision node with multiple outputs
- `endConnector`: Merge point for branches

### New Edge Properties
- `branchId`: Identifies which branch an edge belongs to
- `branchCondition`: Optional condition for branch execution

### Context Methods
- `addBranch(routerId: string): void`
- `removeBranch(routerId: string, branchId: string): void`
- `updateBranchCondition(branchId: string, condition: any): void`
- `getNodesInBranch(branchId: string): WorkflowNode[]`

## User Interactions

1. **Create Router**: Select "Router" from step selector
2. **Add to Branch**: Click plus on branch edge
3. **View Conditions**: Hover over branch edge
4. **Edit Conditions**: Click on router node settings
5. **Merge Branches**: Automatic when adding after branches

## Edge Cases

1. **Empty Branches**: Allow branches with no nodes
2. **Single Branch**: Router with only one active branch
3. **Nested Routers**: Router inside a branch
4. **Branch Loops**: Prevent circular references
5. **Max Branches**: Limit to reasonable number (5-7)

## Performance Considerations

1. **Layout Caching**: Cache branch positions
2. **Incremental Updates**: Only reposition affected nodes
3. **Virtualization**: For large branch networks
4. **Batch Operations**: Group position updates

## Future Enhancements

1. **Conditional Execution**: Runtime branch selection
2. **Branch Templates**: Save and reuse branch patterns
3. **Branch Analytics**: Show execution statistics
4. **Dynamic Branches**: Create branches at runtime
5. **Branch Grouping**: Collapse/expand branch sections