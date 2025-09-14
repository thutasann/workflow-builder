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
import { ApEdgeType, ApNodeType } from '../types/workflow.types'
import { convertApGraphToReactFlow } from '../utils/reactFlowConverter'

// New ActivePieces-style components
import { ApStraightLineEdge } from './edges/ApStraightLineEdge'
import { ApBigAddButtonNode } from './nodes/ApBigAddButtonNode'
import { ApGraphEndNode } from './nodes/ApGraphEndNode'
import { ApLoopReturnNode } from './nodes/ApLoopReturnNode'
import { ApStepNode } from './nodes/ApStepNode'

// Edge components
import { ApLoopReturnEdge } from './edges/ApLoopReturnEdge'
import { ApLoopStartEdge } from './edges/ApLoopStartEdge'
import { ApRouterEndEdge } from './edges/ApRouterEndEdge'
import { ApRouterStartEdge } from './edges/ApRouterStartEdge'
import { CustomEdge } from './edges/CustomEdge'
import { RightPanel } from './RightPanel'
import { StepSelectorHandler } from './StepSelectorHandler'
import { WorkflowHeader } from './WorkflowHeader'

// ActivePieces-style node and edge types
const apNodeTypes = {
  [ApNodeType.STEP]: ApStepNode,
  [ApNodeType.BIG_ADD_BUTTON]: ApBigAddButtonNode,
  [ApNodeType.GRAPH_END_WIDGET]: ApGraphEndNode,
  [ApNodeType.LOOP_RETURN_NODE]: ApLoopReturnNode,
}

const apEdgeTypes = {
  [ApEdgeType.STRAIGHT_LINE]: ApStraightLineEdge,
  [ApEdgeType.ROUTER_START_EDGE]: ApRouterStartEdge,
  [ApEdgeType.ROUTER_END_EDGE]: ApRouterEndEdge,
  [ApEdgeType.LOOP_START_EDGE]: ApLoopStartEdge,
  [ApEdgeType.LOOP_RETURN_EDGE]: ApLoopReturnEdge,
  custom: CustomEdge,
}

const WorkflowCanvasContent: React.FC = () => {
  const { graph, selectStep, onNodesChange, onEdgesChange, onConnect, setSelectedNode, setSelectedEdge } = useWorkflow()

  // Convert our graph to React Flow format (memoized to prevent infinite loops)
  const { nodes, edges } = useMemo(() => {
    try {
      const result = convertApGraphToReactFlow(graph)

      console.group('%c🚀 React Flow Conversion Result', 'color: #4CAF50; font-weight: bold;')
      console.log('%c🟦 Nodes:', 'color: #2196F3; font-weight: bold;', result.nodes)
      console.log('%c🟥 Edges:', 'color: #F44336; font-weight: bold;', result.edges)
      console.groupEnd()

      return result
    } catch (error) {
      console.error('❌ Failed to convert graph to React Flow format:', error)
      return { nodes: [], edges: [] }
    }
  }, [graph])

  const { setViewport } = useReactFlow()

  useEffect(() => {
    // Center the workflow like ActivePieces
    setViewport({ x: 400, y: 100, zoom: 1 })
  }, [setViewport])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      selectStep(node.id)
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
      <RightPanel />
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
        fitView={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color='#e5e7eb' />
        <Controls />
        <MiniMap
          nodeColor={() => '#e5e7eb'}
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
