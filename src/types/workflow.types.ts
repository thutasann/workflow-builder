import type { Node, Edge, NodeProps } from '@xyflow/react'

export type NodeType = 'trigger' | 'action' | 'router' | 'branch' | 'endConnector' | 'branchLabel'

export interface BranchData {
  branchId: string
  condition?: string
  parentRouterId: string
  branchIndex: number
}

export interface RouterNodeData {
  label: string
  type: NodeType
  icon?: string
  description?: string
  config?: Record<string, any>
  integrationLogo?: string
  integrationName?: string
  stepNumber?: string
  branchId?: string
  branches: {
    id: string
    label: string
    condition?: any
  }[]
}

export interface WorkflowNodeData {
  label: string
  type: NodeType
  icon?: string
  description?: string
  config?: Record<string, any>
  integrationLogo?: string
  integrationName?: string
  stepNumber?: string
  branchId?: string // Which branch this node belongs to
  [key: string]: any // Allow additional properties
}

export type WorkflowNode = Node<WorkflowNodeData, NodeType>

export type WorkflowEdge = Edge<{
  label?: string
  condition?: any
  branchId?: string
  branchCondition?: string
  branchLabel?: string
  branchIndex?: number
  isOtherwiseBranch?: boolean
}>

export interface NodePosition {
  nodeId: string
  branchId?: string
  position: { x: number; y: number }
  level: number
}

export interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: string | null
  selectedEdge: string | null
  branches: Map<string, BranchData>
  nodePositions: Map<string, NodePosition>
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
