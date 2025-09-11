import { applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange } from '@xyflow/react'
import React, { createContext, useCallback, useContext, useState, useMemo, type ReactNode } from 'react'
import type { 
  WorkflowEdge, 
  WorkflowNode, 
  WorkflowState,
  FlowVersion,
  FlowTrigger,
  FlowAction,
  ApGraph
} from '../types/workflow.types'
import { FlowTriggerType } from '../types/workflow.types'
import { convertFlowVersionToGraph } from '../utils/graphUtils'

interface WorkflowContextType {
  // Graph-based state
  flowVersion: FlowVersion
  graph: ApGraph
  selectedStep: string | null
  
  // Legacy support
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: string | null
  selectedEdge: string | null
  
  stepSelectorState: {
    isOpen: boolean
    position: { x: number; y: number }
    sourceId: string | null
    targetId: string | null
    sourceHandle?: string | null
  }
  
  // Graph operations
  addAction: (parentStepName: string, action: FlowAction) => void
  addTrigger: (trigger: FlowTrigger) => void
  updateStep: (stepName: string, updates: Partial<FlowAction | FlowTrigger>) => void
  deleteStep: (stepName: string) => void
  selectStep: (stepName: string | null) => void
  
  // Legacy operations
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: WorkflowNode) => void
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void
  deleteNode: (nodeId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  setSelectedEdge: (edgeId: string | null) => void
  clearWorkflow: () => void
  openStepSelector: (sourceId: string, targetId: string, position: { x: number; y: number }, sourceHandle?: string | null) => void
  closeStepSelector: () => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider')
  }
  return context
}

interface WorkflowProviderProps {
  children: ReactNode
}

// Create initial empty trigger
const createEmptyTrigger = (): FlowTrigger => ({
  name: 'trigger',
  displayName: 'Start',
  type: FlowTriggerType.EMPTY,
  settings: {},
})

// Create initial flow version
const createInitialFlowVersion = (): FlowVersion => ({
  id: 'flow-1',
  trigger: createEmptyTrigger(),
  version: 1,
})

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [flowVersion, setFlowVersion] = useState<FlowVersion>(createInitialFlowVersion())
  const [selectedStep, setSelectedStep] = useState<string | null>(null)
  
  // Generate graph from flow version (memoized to prevent infinite loops)
  const graph = useMemo(() => {
    try {
      return convertFlowVersionToGraph(flowVersion.trigger)
    } catch (error) {
      console.error('Error generating graph:', error)
      return { nodes: [], edges: [] }
    }
  }, [flowVersion.trigger])
  
  // Legacy state for backward compatibility
  const [state, setState] = useState<WorkflowState>({
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedEdge: null,
    branches: new Map(),
    nodePositions: new Map(),
  })
  
  const [stepSelectorState, setStepSelectorState] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    sourceId: null as string | null,
    targetId: null as string | null,
    sourceHandle: null as string | null | undefined,
  })

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setState((state) => ({
      ...state,
      nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
    }))
  }, [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setState((state) => ({
      ...state,
      edges: applyEdgeChanges(changes, state.edges) as WorkflowEdge[],
    }))
  }, [])

  const onConnect = useCallback((connection: Connection) => {
    setState((state) => {
      // Check if edge already exists
      const edgeExists = state.edges.some(
        (edge) => edge.source === connection.source && edge.target === connection.target
      )
      if (edgeExists) {
        return state // Don't add duplicate edge
      }

      // Create edge with custom type
      const newEdge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        type: 'custom',
      } as WorkflowEdge

      return {
        ...state,
        edges: [...state.edges, newEdge],
      }
    })
  }, [])

  const addNode = useCallback((node: WorkflowNode) => {
    setState((state) => {
      // Check if node with this ID already exists
      if (state.nodes.some((n) => n.id === node.id)) {
        return state // Don't add duplicate
      }
      return {
        ...state,
        nodes: [...state.nodes, node],
      }
    })
  }, [])

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setState((state) => ({
      ...state,
      nodes: state.nodes.map((node) => (node.id === nodeId ? { ...node, ...updates } : node)),
    }))
  }, [])

  const deleteNode = useCallback((nodeId: string) => {
    setState((state) => ({
      ...state,
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    }))
  }, [])

  const setSelectedNode = useCallback((nodeId: string | null) => {
    setState((state) => ({
      ...state,
      selectedNode: nodeId,
    }))
  }, [])

  const setSelectedEdge = useCallback((edgeId: string | null) => {
    setState((state) => ({
      ...state,
      selectedEdge: edgeId,
    }))
  }, [])

  const clearWorkflow = useCallback(() => {
    setFlowVersion(createInitialFlowVersion())
    setSelectedStep(null)
    setState({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      branches: new Map(),
      nodePositions: new Map(),
    })
  }, [])

  const openStepSelector = useCallback((sourceId: string, targetId: string, position: { x: number; y: number }, sourceHandle?: string | null) => {
    setStepSelectorState({
      isOpen: true,
      position,
      sourceId,
      targetId,
      sourceHandle: sourceHandle || null,
    })
  }, [])

  const closeStepSelector = useCallback(() => {
    setStepSelectorState({
      isOpen: false,
      position: { x: 0, y: 0 },
      sourceId: null,
      targetId: null,
      sourceHandle: null,
    })
  }, [])

  // Graph-based operations
  const addAction = useCallback((parentStepName: string, action: FlowAction) => {
    setFlowVersion((prev) => {
      // Find the parent step and add the action as nextAction
      const updateStep = (step: FlowAction | FlowTrigger): FlowAction | FlowTrigger => {
        if (step.name === parentStepName) {
          return { ...step, nextAction: action }
        }
        if ('nextAction' in step && step.nextAction) {
          return { ...step, nextAction: updateStep(step.nextAction) as FlowAction }
        }
        return step
      }
      
      return {
        ...prev,
        trigger: updateStep(prev.trigger) as FlowTrigger,
      }
    })
  }, [])
  
  const addTrigger = useCallback((trigger: FlowTrigger) => {
    setFlowVersion((prev) => ({
      ...prev,
      trigger,
    }))
  }, [])
  
  const updateStep = useCallback((stepName: string, updates: Partial<FlowAction | FlowTrigger>) => {
    setFlowVersion((prev) => {
      const updateStepRecursive = (step: FlowAction | FlowTrigger): FlowAction | FlowTrigger => {
        if (step.name === stepName) {
          return { ...step, ...updates }
        }
        if ('nextAction' in step && step.nextAction) {
          return { ...step, nextAction: updateStepRecursive(step.nextAction) as FlowAction }
        }
        return step
      }
      
      return {
        ...prev,
        trigger: updateStepRecursive(prev.trigger) as FlowTrigger,
      }
    })
  }, [])
  
  const deleteStep = useCallback((stepName: string) => {
    setFlowVersion((prev) => {
      const deleteStepRecursive = (step: FlowAction | FlowTrigger): FlowAction | FlowTrigger | undefined => {
        if ('nextAction' in step && step.nextAction?.name === stepName) {
          return { ...step, nextAction: step.nextAction.nextAction }
        }
        if ('nextAction' in step && step.nextAction) {
          const updatedNext = deleteStepRecursive(step.nextAction)
          return { ...step, nextAction: updatedNext as FlowAction }
        }
        return step
      }
      
      const updatedTrigger = deleteStepRecursive(prev.trigger) as FlowTrigger
      return {
        ...prev,
        trigger: updatedTrigger,
      }
    })
  }, [])
  
  const selectStep = useCallback((stepName: string | null) => {
    setSelectedStep(stepName)
  }, [])
  
  const contextValue: WorkflowContextType = {
    // Graph-based state
    flowVersion,
    graph,
    selectedStep,
    
    // Graph operations
    addAction,
    addTrigger,
    updateStep,
    deleteStep,
    selectStep,
    
    // Legacy support
    nodes: graph.nodes as unknown as WorkflowNode[],
    edges: graph.edges as unknown as WorkflowEdge[],
    selectedNode: state.selectedNode,
    selectedEdge: state.selectedEdge,
    stepSelectorState,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    setSelectedNode,
    setSelectedEdge,
    clearWorkflow,
    openStepSelector,
    closeStepSelector,
  }

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>
}
