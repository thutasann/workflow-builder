# Workflow Edges Architecture

## Overview
This document illustrates the edge types and their behaviors in the workflow builder system using Mermaid diagrams.

## Edge Types Class Hierarchy

```mermaid
classDiagram
    class ApEdge {
        <<abstract>>
        +id: string
        +source: string
        +target: string
        +type: ApEdgeType
        +data: object
    }
    
    class ApStraightLineEdge {
        +type: STRAIGHT_LINE
        +drawArrowHead: boolean
        +hideAddButton: boolean
        +parentStepName: string
        +isAfterLoop: boolean
    }
    
    class ApRouterStartEdge {
        +type: ROUTER_START_EDGE
        +isBranchEmpty: boolean
        +label: string
        +branchIndex: number
        +stepLocationRelativeToParent: string
        +drawHorizontalLine: boolean
        +drawStartingVerticalLine: boolean
    }
    
    class ApRouterEndEdge {
        +type: ROUTER_END_EDGE
        +drawEndingVerticalLine: boolean
        +verticalSpaceBetweenLastNodeInBranchAndEndLine: number
        +drawHorizontalLine: boolean
        +routerOrBranchStepName: string
        +isNextStepEmpty: boolean
    }
    
    class ApLoopStartEdge {
        +type: LOOP_START_EDGE
        +isLoopEmpty: boolean
    }
    
    class ApLoopReturnEdge {
        +type: LOOP_RETURN_EDGE
        +parentStepName: string
        +isLoopEmpty: boolean
        +drawArrowHeadAfterEnd: boolean
        +verticalSpaceBetweenReturnNodeStartAndEnd: number
    }
    
    ApEdge <|-- ApStraightLineEdge
    ApEdge <|-- ApRouterStartEdge
    ApEdge <|-- ApRouterEndEdge
    ApEdge <|-- ApLoopStartEdge
    ApEdge <|-- ApLoopReturnEdge
```

## Edge Connection Flow Sequence

```mermaid
sequenceDiagram
    participant Trigger
    participant Action1
    participant Router
    participant Branch1
    participant Otherwise
    participant Loop
    participant LoopBody
    participant EndNode

    Trigger->>Action1: StraightLineEdge
    Action1->>Router: StraightLineEdge
    
    Router->>Branch1: RouterStartEdge (label: "Branch 1")
    Router->>Otherwise: RouterStartEdge (label: "Otherwise")
    
    Branch1->>EndNode: RouterEndEdge
    Otherwise->>Loop: StraightLineEdge
    
    Loop->>LoopBody: LoopStartEdge
    LoopBody->>Loop: LoopReturnEdge
    Loop->>EndNode: StraightLineEdge (isAfterLoop: true)
```

## Edge Rendering Sequence

```mermaid
sequenceDiagram
    participant Component as Edge Component
    participant SVG as SVG Renderer
    participant Path as Path Calculator
    participant Button as Add Button
    participant Style as Style Engine

    Component->>Path: Request path calculation
    Path->>Path: Calculate source position
    Path->>Path: Add vertical offset
    Path->>Path: Determine edge type
    
    alt StraightLine Edge
        Path->>Path: Calculate vertical length
        Path->>Path: Create M x y v[length]
    else Router Start Edge
        Path->>Path: Calculate branch offset
        Path->>Path: Create curved path with arcs
    else Loop Return Edge
        Path->>Path: Calculate return distance
        Path->>Path: Create two-segment path
    end
    
    Path->>SVG: Return path string
    Component->>Style: Apply styling
    Style->>SVG: Set stroke, width, color
    
    Component->>Button: Check if add button needed
    alt Show Add Button
        Button->>Button: Calculate midpoint
        Button->>SVG: Render foreignObject
        Button->>SVG: Add click handler
    end
    
    SVG->>Component: Return rendered edge
```

## Edge Interaction State Sequence

```mermaid
sequenceDiagram
    participant User
    participant Edge
    participant AddButton
    participant Selector
    participant Workflow

    User->>Edge: Mouse enters edge area
    Edge->>Edge: Change to hover state
    Edge->>AddButton: Show add button
    
    User->>AddButton: Hover over button
    AddButton->>AddButton: Highlight state
    
    User->>AddButton: Click button
    AddButton->>Workflow: openStepSelectorForStep()
    Workflow->>Selector: Show step selector
    
    User->>Selector: Select node type
    Selector->>Workflow: addAction()
    Workflow->>Workflow: Update flow structure
    Workflow->>Edge: Re-render edges
    
    User->>Edge: Mouse leaves
    Edge->>AddButton: Hide add button
    Edge->>Edge: Return to idle state
```

## Edge Data Flow for Adding Nodes

```mermaid
sequenceDiagram
    participant User
    participant AddButton
    participant StepSelector
    participant WorkflowContext
    participant GraphUtils
    participant ReactFlow

    User->>AddButton: Click Add Button
    AddButton->>WorkflowContext: openStepSelectorForStep(parentStepName, position, branchIndex?, stepLocation?)
    
    WorkflowContext->>StepSelector: Show Selector
    User->>StepSelector: Select Node Type
    StepSelector->>WorkflowContext: addAction(parentStepName, newAction, branchIndex?, stepLocation?)
    
    alt Loop-subgraph-end + AFTER
        WorkflowContext->>WorkflowContext: Extract Loop Name from ID
        WorkflowContext->>WorkflowContext: Find loop step
        WorkflowContext->>WorkflowContext: Add as nextAction
    else Router branch
        WorkflowContext->>WorkflowContext: Add to branch array
    else Loop inside
        WorkflowContext->>WorkflowContext: Add as firstLoopAction
    else Normal
        WorkflowContext->>WorkflowContext: Add as nextAction
    end
    
    WorkflowContext->>GraphUtils: convertFlowVersionToGraph()
    GraphUtils->>GraphUtils: buildGraph() recursively
    GraphUtils->>GraphUtils: Create nodes
    GraphUtils->>GraphUtils: Create edges
    GraphUtils->>ReactFlow: Update Graph
    
    ReactFlow->>User: Display Updated Workflow
```

## Edge Path Calculation Sequence

```mermaid
sequenceDiagram
    participant EdgeComponent
    participant PathCalc as Path Calculator
    participant Constants
    participant SVG

    EdgeComponent->>PathCalc: Request path(sourceX, sourceY, targetY, edgeType)
    
    PathCalc->>Constants: Get VERTICAL_SPACE_BETWEEN_STEP_AND_LINE
    Constants-->>PathCalc: Return 5px
    
    PathCalc->>PathCalc: lineStartY = sourceY + 5
    
    alt Straight Line Edge
        PathCalc->>PathCalc: lineLength = targetY - sourceY - 10
        PathCalc->>PathCalc: path = M sourceX lineStartY v lineLength
    else Router Start Edge
        PathCalc->>Constants: Get ARC_LENGTH
        Constants-->>PathCalc: Return 25px
        PathCalc->>PathCalc: Calculate curved segments
        PathCalc->>PathCalc: path = M x y v25 q25,0 25,25 h100 q25,0 25,25 v50
    else Loop Return Edge
        PathCalc->>PathCalc: Calculate two-segment path
        PathCalc->>PathCalc: Add horizontal arrow in middle
    end
    
    PathCalc->>EdgeComponent: Return path string
    EdgeComponent->>SVG: Render path element
    SVG->>EdgeComponent: Edge rendered
```

## Edge Lifecycle Sequence

```mermaid
sequenceDiagram
    participant Flow as Flow Structure
    participant GraphBuilder
    participant EdgeFactory
    participant ReactFlow
    participant DOM

    Flow->>GraphBuilder: Node added/modified
    GraphBuilder->>GraphBuilder: Analyze node type
    
    alt Has nextAction
        GraphBuilder->>EdgeFactory: Create inter-step edge
        alt Parent is Loop
            EdgeFactory->>EdgeFactory: source = loop-subgraph-end
            EdgeFactory->>EdgeFactory: isAfterLoop = true
        else Parent is Router
            EdgeFactory->>EdgeFactory: source = router-subgraph-end
        else Normal
            EdgeFactory->>EdgeFactory: source = parent.id
        end
    else No nextAction & Loop/Router
        GraphBuilder->>EdgeFactory: Create edge to graph end
    end
    
    EdgeFactory->>GraphBuilder: Return edge object
    GraphBuilder->>ReactFlow: Add edge to graph
    
    ReactFlow->>DOM: Render edge component
    DOM->>DOM: Attach event listeners
    
    loop While edge exists
        DOM->>DOM: Handle mouse events
        DOM->>DOM: Show/hide add button
        DOM->>Flow: Handle add node clicks
    end
    
    Flow->>GraphBuilder: Node removed
    GraphBuilder->>ReactFlow: Remove edge
    ReactFlow->>DOM: Unmount component
    DOM->>DOM: Clean up listeners
```

## Edge Types Summary

| Edge Type | Connection Pattern | Visual Representation |
|-----------|-------------------|----------------------|
| **StraightLineEdge** | Sequential nodes | Vertical line with optional arrow |
| **RouterStartEdge** | Router to branches | Curved path with branch label |
| **RouterEndEdge** | Branches to merge | Curved merge path |
| **LoopStartEdge** | Loop to first action | Right-curving path |
| **LoopReturnEdge** | Last action to loop | Two-segment return path with arrow |

## Key Constants

```mermaid
graph TD
    subgraph Vertical Spacing
        VS1[VERTICAL_SPACE_BETWEEN_STEPS = 100px]
        VS2[VERTICAL_SPACE_BETWEEN_STEP_AND_LINE = 5px]
        VS3[VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD = 157px]
    end
    
    subgraph Horizontal Spacing
        HS1[HORIZONTAL_SPACE_BETWEEN_NODES = 120px]
    end
    
    subgraph Arc Dimensions
        AD1[ARC_LENGTH = 25px]
        AD2[LINE_WIDTH = 2px]
    end
```