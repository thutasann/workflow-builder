import type { Node, Edge, NodeProps } from '@xyflow/react'

export type NodeType = 'trigger' | 'action' | 'router' | 'branch'

export interface WorkflowNodeData {
  label: string
  type: NodeType
  icon?: string
  description?: string
  config?: Record<string, any>
  integrationLogo?: string
  integrationName?: string
  stepNumber?: string
  [key: string]: any // Allow additional properties
}

export type WorkflowNode = Node<WorkflowNodeData, NodeType>

export type WorkflowEdge = Edge<{
  label?: string
  condition?: any
}>

export interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: string | null
  selectedEdge: string | null
}

export interface NodeTemplate {
  type: NodeType
  label: string
  icon: string
  category: string
  description: string
  defaultData: Partial<WorkflowNodeData>
}

export type CustomNodeProps = NodeProps<WorkflowNode>
