import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import React, { useCallback, useEffect, useMemo } from 'react'

import { useWorkflow } from '../context/WorkflowContext'
import { ApNodeType, ApEdgeType } from '../types/workflow.types'
import { convertApGraphToReactFlow } from '../utils/reactFlowConverter'

// New ActivePieces-style components
import { ApStepNode } from './nodes/ApStepNode'
import { ApBigAddButtonNode } from './nodes/ApBigAddButtonNode'
import { ApGraphEndNode } from './nodes/ApGraphEndNode'
import { ApStraightLineEdge } from './edges/ApStraightLineEdge'

// Legacy components for backward compatibility
import { CustomEdge } from './edges/CustomEdge'
import { ActionNode } from './nodes/ActionNode'
import { RouterNode } from './nodes/RouterNode'
import { TriggerNode } from './nodes/TriggerNode'
import { EndConnectorNode } from './nodes/EndConnectorNode'
import { BranchLabelNode } from './nodes/BranchLabelNode'
import { WorkflowHeader } from './WorkflowHeader'
import { StepSelectorHandler } from './StepSelectorHandler'

// ActivePieces-style node and edge types
const apNodeTypes = {
  [ApNodeType.STEP]: ApStepNode,
  [ApNodeType.BIG_ADD_BUTTON]: ApBigAddButtonNode,
  [ApNodeType.GRAPH_END_WIDGET]: ApGraphEndNode,
  // Legacy support
  trigger: TriggerNode,
  action: ActionNode,
  router: RouterNode,
  endConnector: EndConnectorNode,
  branchLabel: BranchLabelNode,
}

const apEdgeTypes = {
  [ApEdgeType.STRAIGHT_LINE]: ApStraightLineEdge,
  // Legacy support
  custom: CustomEdge,
}

const WorkflowCanvasContent: React.FC = () => {
  const { 
    graph, 
    selectStep,
    // Legacy support
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    setSelectedNode, 
    setSelectedEdge 
  } = useWorkflow()
  
  // Convert our graph to React Flow format (memoized to prevent infinite loops)
  const { nodes, edges } = useMemo(() => {
    try {
      return convertApGraphToReactFlow(graph)
    } catch (error) {
      console.error('Failed to convert graph to React Flow format:', error)
      return { nodes: [], edges: [] }
    }
  }, [graph])

  const { setViewport } = useReactFlow()

  useEffect(() => {
    setViewport({ x: 100, y: 100, zoom: 1 })
  }, [setViewport])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      // Use new graph-based selection
      selectStep(node.id)
      // Legacy support
      setSelectedNode(node.id)
      setSelectedEdge(null)
    },
    [selectStep, setSelectedNode, setSelectedEdge]
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      setSelectedEdge(edge.id)
      setSelectedNode(null)
    },
    [setSelectedNode, setSelectedEdge]
  )

  const onPaneClick = useCallback(() => {
    selectStep(null)
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [selectStep, setSelectedNode, setSelectedEdge])

  return (
    <div style={{ width: '100%', height: '100vh', background: '#fafafa', position: 'relative' }}>
      <WorkflowHeader />
      <StepSelectorHandler />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={apNodeTypes}
        edgeTypes={apEdgeTypes}
        defaultEdgeOptions={{
          type: ApEdgeType.STRAIGHT_LINE,
          animated: false,
        }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color='#e5e7eb' />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === 'trigger') return '#6366f1'
            return '#e5e7eb'
          }}
          style={{
            background: '#fff',
            border: '1px solid #e5e7eb',
          }}
        />
      </ReactFlow>
    </div>
  )
}

export const WorkflowCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvasContent />
    </ReactFlowProvider>
  )
}
