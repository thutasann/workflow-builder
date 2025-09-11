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
import React, { useCallback, useEffect } from 'react'

import { useWorkflow } from '../context/WorkflowContext'
import { CustomEdge } from './edges/CustomEdge'
import { CustomBranchEdge } from './edges/CustomBranchEdge'
import { MergeEdge } from './edges/MergeEdge'
import { ActionNode } from './nodes/ActionNode'
import { RouterNode } from './nodes/RouterNode'
import { TriggerNode } from './nodes/TriggerNode'
import { EndConnectorNode } from './nodes/EndConnectorNode'
import { BranchLabelNode } from './nodes/BranchLabelNode'
import { WorkflowHeader } from './WorkflowHeader'
import { StepSelectorHandler } from './StepSelectorHandler'

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  router: RouterNode,
  endConnector: EndConnectorNode,
  branchLabel: BranchLabelNode,
}

const edgeTypes = {
  custom: CustomEdge,
  branch: CustomBranchEdge,
  merge: MergeEdge,
}

const WorkflowCanvasContent: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, setSelectedEdge } = useWorkflow()

  const { setViewport } = useReactFlow()

  useEffect(() => {
    setViewport({ x: 100, y: 100, zoom: 1 })
  }, [setViewport])

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      setSelectedNode(node.id)
      setSelectedEdge(null)
    },
    [setSelectedNode, setSelectedEdge]
  )

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: any) => {
      setSelectedEdge(edge.id)
      setSelectedNode(null)
    },
    [setSelectedNode, setSelectedEdge]
  )

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }, [setSelectedNode, setSelectedEdge])

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
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: 'custom',
          animated: false,
        }}
        nodesDraggable={false}
        nodesConnectable={true}
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
