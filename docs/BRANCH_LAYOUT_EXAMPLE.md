# Branch Layout Visual Example

## Layout Dimensions and Spacing

### Base Configuration

```
Center X: 400px (main flow alignment)
Branch Spacing: 250px (horizontal distance between branches)
Node Spacing: 200px (vertical distance between nodes)
Node Width: 350px
```

### Branch X-Position Calculation

For a router with 3 branches:

```
Branch 1 X: 400 - 250 = 150px (left branch)
Branch 2 X: 400px (center branch)
Branch 3 X: 400 + 250 = 650px (right branch)
```

## Visual Layout Example

```
                          Y=100    [1. Slack Trigger]
                                         (400, 100)
                                             |
                          Y=300      [2. Get User Data]
                                         (400, 300)
                                             |
                          Y=500          [3. Router]
                                         (400, 500)
                                    /        |        \
                                   /         |         \
                          Y=700    /          |          \
                    [4. Send Email]    [4. Send SMS]    [4. Send Push]
                      (150, 700)         (400, 700)       (650, 700)
                           |                  |                 |
                          Y=900              |                 |
                    [5. Log Email]     [5. Log SMS]     [5. Log Push]
                      (150, 900)         (400, 900)       (650, 900)
                           |                  |                 |
                          Y=1100             |                 |
                    [6. Update DB]     [6. Update DB]   [6. Update DB]
                      (150, 1100)        (400, 1100)      (650, 1100)
                           \                  |                /
                            \                 |               /
                          Y=1300  \           |           /
                                   \          |          /
                                    \         |         /
                                     [7. End Connector]
                                         (400, 1300)
                                             |
                          Y=1500        [8. Archive]
                                         (400, 1500)
```

## Step-by-Step Node Addition Process

### 1. Initial State

```
[Trigger] → [Action] → [Router]
```

### 2. Add First Branch Node

User clicks plus button on Branch 1 edge:

```
[Router]
    |
    ├── [New Node] (150, 700)
    ├── (empty)
    └── (empty)
```

### 3. Add Nodes to Other Branches

```
[Router]
    |
    ├── [Email] (150, 700)
    ├── [SMS] (400, 700)
    └── [Push] (650, 700)
```

### 4. Automatic End Connector Creation

When first node is added after router:

```
[Router]
    |
    ├── [Email] →
    ├── [SMS]   → [End Connector]
    └── [Push]  →
```

### 5. Continue Main Flow

Click plus after End Connector:

```
[End Connector]
       |
   [Archive]
```

## Node Positioning Algorithm

```typescript
function layoutBranchNetwork(
  router: WorkflowNode,
  branches: BranchNode[][],
  endConnector: WorkflowNode
): LayoutUpdate[] {
  const updates: LayoutUpdate[] = []
  const routerY = router.position.y
  const branchStartY = routerY + 200

  // Calculate branch X positions
  const branchXPositions = [150, 400, 650] // For 3 branches

  // Find the longest branch
  const maxBranchLength = Math.max(...branches.map((b) => b.length))

  // Position nodes in each branch
  branches.forEach((branchNodes, branchIndex) => {
    const branchX = branchXPositions[branchIndex]
    let currentY = branchStartY

    branchNodes.forEach((node, nodeIndex) => {
      updates.push({
        nodeId: node.id,
        position: { x: branchX, y: currentY },
      })
      currentY += 200
    })
  })

  // Position end connector below longest branch
  const endConnectorY = branchStartY + maxBranchLength * 200
  updates.push({
    nodeId: endConnector.id,
    position: { x: 400, y: endConnectorY },
  })

  return updates
}
```

## Edge Routing

### Branch Edges (Straight Vertical)

- Router to first branch node: Straight down
- Between branch nodes: Straight vertical lines
- Maintains clean vertical flow within each branch

### Merge Edges (Diagonal)

- From last branch node to End Connector
- Diagonal lines converging at center
- Smooth path calculation for visual clarity

### Example Edge Paths

```typescript
// Branch 1 to End Connector
const branch1MergePath = {
  source: { x: 150, y: 1100 }, // Last node in branch 1
  target: { x: 400, y: 1300 }, // End connector
  // Creates diagonal line from left branch to center
}

// Branch 3 to End Connector
const branch3MergePath = {
  source: { x: 650, y: 1100 }, // Last node in branch 3
  target: { x: 400, y: 1300 }, // End connector
  // Creates diagonal line from right branch to center
}
```

## Responsive Considerations

### Minimum Spacing

- Horizontal: 200px minimum between branches
- Vertical: 150px minimum between nodes

### Maximum Branches

- Desktop: Up to 5 branches comfortably
- Tablet: 3 branches maximum
- Mobile: Consider vertical stacking

### Zoom Levels

- Fit view automatically when branches added
- Maintain readability at all zoom levels
- Focus on active branch during editing
