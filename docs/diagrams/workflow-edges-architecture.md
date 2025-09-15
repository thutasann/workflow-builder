# Workflow Edges Architecture - PlantUML Diagrams

## Overview
This document contains PlantUML diagrams illustrating the edge types and their behaviors in the workflow builder system.

## Edge Types Class Hierarchy

```plantuml
@startuml
!theme plain
title Edge Types Hierarchy

abstract class ApEdge {
  +id: string
  +source: string
  +target: string
  +type: ApEdgeType
  +data: object
}

class ApStraightLineEdge {
  +type: STRAIGHT_LINE
  +data: {
    drawArrowHead: boolean
    hideAddButton?: boolean
    parentStepName: string
    isAfterLoop?: boolean
  }
}

class ApRouterStartEdge {
  +type: ROUTER_START_EDGE
  +data: {
    isBranchEmpty: boolean
    label: string
    branchIndex: number
    stepLocationRelativeToParent: string
    drawHorizontalLine: boolean
    drawStartingVerticalLine: boolean
  }
}

class ApRouterEndEdge {
  +type: ROUTER_END_EDGE
  +data: {
    drawEndingVerticalLine: boolean
    verticalSpaceBetweenLastNodeInBranchAndEndLine: number
    drawHorizontalLine: boolean
    routerOrBranchStepName: string
    isNextStepEmpty: boolean
  }
}

class ApLoopStartEdge {
  +type: LOOP_START_EDGE
  +data: {
    isLoopEmpty: boolean
  }
}

class ApLoopReturnEdge {
  +type: LOOP_RETURN_EDGE
  +data: {
    parentStepName: string
    isLoopEmpty: boolean
    drawArrowHeadAfterEnd: boolean
    verticalSpaceBetweenReturnNodeStartAndEnd: number
  }
}

ApEdge <|-- ApStraightLineEdge
ApEdge <|-- ApRouterStartEdge
ApEdge <|-- ApRouterEndEdge
ApEdge <|-- ApLoopStartEdge
ApEdge <|-- ApLoopReturnEdge

@enduml
```

## Edge Connection Patterns

```plantuml
@startuml
!theme plain
title Edge Connection Patterns

package "Normal Flow" {
  [Trigger] --> [Action 1] : StraightLineEdge
  [Action 1] --> [Action 2] : StraightLineEdge
  [Action 2] --> [End] : StraightLineEdge
}

package "Router Flow" {
  [Router] --> [Branch 1] : RouterStartEdge\n(label: "Branch 1")
  [Router] --> [Otherwise] : RouterStartEdge\n(label: "Otherwise")
  [Branch 1] --> [Action A]
  [Otherwise] --> [Action B]
  [Action A] --> [Merge] : RouterEndEdge
  [Action B] --> [Merge] : RouterEndEdge
}

package "Loop Flow" {
  [Loop] --> [First Action] : LoopStartEdge
  [First Action] --> [Next Action]
  [Next Action] --> [Loop Return] : LoopReturnEdge
  [Loop Return] ..> [Loop] : returns to
  [Loop] --> [After Loop] : StraightLineEdge\n(isAfterLoop: true)
}

@enduml
```

## Edge Rendering Components

```plantuml
@startuml
!theme plain
title Edge Rendering Components

component ApStraightLineEdge {
  card "Path Rendering" {
    [Start Point] --> [End Point] : Vertical Line
    note right: M x y v[length]
  }
  
  card "Add Button" {
    [Plus Button]
    note right: Shows at midpoint\nunless hideAddButton=true
  }
  
  card "Arrow Head" {
    [Arrow]
    note right: Shows if drawArrowHead=true
  }
}

component ApRouterStartEdge {
  card "Path Segments" {
    [Vertical Start] --> [Arc Right Down]
    [Arc Right Down] --> [Horizontal Line]
    [Horizontal Line] --> [Arc Right]
    [Arc Right] --> [Vertical End]
  }
  
  card "Branch Label" {
    [foreignObject]
    note right: Contains branch name\n(Branch 1 or Otherwise)
  }
}

component ApLoopReturnEdge {
  card "Return Path" {
    [Start] --> [Arc Left Down]
    [Arc Left Down] --> [Horizontal Left]
    [Horizontal Left] --> [Arc Right Up]
    [Arc Right Up] --> [Vertical Up]
  }
  
  card "Arrow Segment" {
    [Horizontal Arrow]
    note right: Right-pointing arrow\nin the middle
  }
}

@enduml
```

## Edge State Machine

```plantuml
@startuml
!theme plain
title Edge Interaction States

[*] --> Idle

Idle --> Hovering : Mouse Enter
Hovering --> ShowAddButton : Not Hidden
Hovering --> Idle : Mouse Leave

ShowAddButton --> ButtonHovered : Hover Button
ButtonHovered --> Opening : Click
ButtonHovered --> ShowAddButton : Leave Button

Opening --> StepSelector : Open Selector
StepSelector --> AddingNode : Select Node Type
AddingNode --> Idle : Node Added

state "Edge States" {
  Idle : Default state
  Hovering : Edge highlighted
  ShowAddButton : Plus button visible
  ButtonHovered : Button highlighted
}

state "Action States" {
  Opening : Opening selector
  StepSelector : Selector open
  AddingNode : Creating node
}

@enduml
```

## Edge Path Calculations

```plantuml
@startuml
!theme plain
title Edge Path Calculation Flow

start

:Calculate Source Position;
note right: sourceX, sourceY from node

:Add Vertical Offset;
note right: sourceY + VERTICAL_SPACE_BETWEEN_STEP_AND_LINE

:Determine Edge Type;

if (Edge Type?) then (StraightLine)
  :Calculate Vertical Length;
  :Create Simple Path;
  :M x y v[length];
elseif (RouterStart) then
  :Calculate Branch Offset;
  :Add Horizontal Spacing;
  :Create Multi-segment Path;
  :M x y v h arc v arrow;
elseif (LoopReturn) then
  :Calculate Return Distance;
  :Create Complex Path;
  :Two segments with arrow;
else (LoopStart)
  :Calculate Loop Offset;
  :Create Curved Path;
  :M x y v arc h arc v;
endif

:Apply Styling;
note right: strokeWidth, color

:Render SVG Path;

if (Show Add Button?) then (yes)
  :Calculate Button Position;
  :Render Add Button;
else (no)
  :Skip Button;
endif

stop

@enduml
```

## Edge Data Flow

```plantuml
@startuml
!theme plain
title Edge Data Flow and Updates

actor User
participant "Add Button" as AB
participant "Step Selector" as SS
participant "Workflow Context" as WC
participant "Graph Utils" as GU
participant "React Flow" as RF

User -> AB: Click Add Button
AB -> WC: openStepSelectorForStep(\n  parentStepName,\n  position,\n  branchIndex?,\n  stepLocation\n)

WC -> SS: Show Selector
User -> SS: Select Node Type
SS -> WC: addAction(\n  parentStepName,\n  newAction,\n  branchIndex?,\n  stepLocation\n)

WC -> WC: Determine Parent Type
alt Loop-subgraph-end + AFTER
  WC -> WC: Extract Loop Name
  WC -> WC: Add as nextAction
else Normal Parent
  WC -> WC: Add to Parent
end

WC -> GU: convertFlowVersionToGraph()
GU -> GU: buildGraph() recursively
GU -> GU: Create new edges
GU -> RF: Update Graph

RF -> User: Display Updated Workflow

@enduml
```

## Edge Positioning Constants

```plantuml
@startuml
!theme plain
title Edge Positioning Constants

package "Vertical Spacing" {
  object VERTICAL_SPACE_BETWEEN_STEPS {
    value = 100
    usage = "Between sequential nodes"
  }
  
  object VERTICAL_SPACE_BETWEEN_STEP_AND_LINE {
    value = 5
    usage = "Node to edge start"
  }
  
  object VERTICAL_OFFSET_BETWEEN_LOOP_AND_CHILD {
    value = 157
    usage = "Loop to first child"
  }
}

package "Horizontal Spacing" {
  object HORIZONTAL_SPACE_BETWEEN_NODES {
    value = 120
    usage = "Between branches/loops"
  }
}

package "Arc Dimensions" {
  object ARC_LENGTH {
    value = 25
    usage = "Curve radius"
  }
  
  object LINE_WIDTH {
    value = 2
    usage = "Edge stroke width"
  }
}

package "SVG Patterns" {
  object ARROW_DOWN {
    value = "l-5,10 m5,-10 l5,10"
    usage = "Downward arrow"
  }
  
  object ARC_RIGHT_DOWN {
    value = "q25,0 25,25"
    usage = "Right-down curve"
  }
}

@enduml
```

## Edge Lifecycle

```plantuml
@startuml
!theme plain
title Edge Lifecycle

|Graph Building|
start
:Node Added to Flow;
:Determine Node Type;

|Edge Creation|
if (Has Next Action?) then (yes)
  :Create Inter-step Edge;
  if (Parent is Loop?) then (yes)
    :Source = loop-subgraph-end;
    :Mark isAfterLoop = true;
  elseif (Parent is Router?) then (yes)
    :Source = router-subgraph-end;
  else (Normal)
    :Source = parent node;
  endif
else (no)
  if (Loop/Router?) then (yes)
    :Create Edge to Graph End;
  endif
endif

|Rendering|
:Calculate Positions;
:Generate SVG Path;
:Add Interactive Elements;

|Interaction|
repeat
  :Listen for Events;
  :Show/Hide Add Button;
  :Handle Clicks;
repeat while (Edge Exists?) is (yes)

|Cleanup|
:Remove from DOM;
:Clear Event Listeners;
stop

@enduml
```