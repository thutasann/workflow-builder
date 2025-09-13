import React, { createContext, useCallback, useContext, useState, useMemo, type ReactNode } from 'react'
import type {
  FlowVersion,
  FlowTrigger,
  FlowAction,
  ApGraph,
  RouterAction,
  LoopOnItemsAction,
} from '../types/workflow.types'
import { FlowTriggerType, FlowActionType } from '../types/workflow.types'
import { convertFlowVersionToGraph } from '../utils/graphUtils'

interface WorkflowContextType {
  // Graph-based state
  flowVersion: FlowVersion
  graph: ApGraph
  selectedStep: string | null

  stepSelectorState: {
    isOpen: boolean
    position: { x: number; y: number }
    parentStepName: string | null
    branchIndex?: number
  }

  // Graph operations
  addAction: (parentStepName: string, action: FlowAction, branchIndex?: number) => void
  addTrigger: (trigger: FlowTrigger) => void
  updateStep: (stepName: string, updates: Partial<FlowAction | FlowTrigger>) => void
  deleteStep: (stepName: string) => void
  selectStep: (stepName: string | null) => void
  clearWorkflow: () => void
  openStepSelectorForStep: (parentStepName: string, position: { x: number; y: number }, branchIndex?: number) => void
  closeStepSelector: () => void

  // Temporary React Flow compatibility
  onNodesChange: () => void
  onEdgesChange: () => void
  onConnect: () => void
  setSelectedNode: (nodeId: string | null) => void
  setSelectedEdge: (edgeId: string | null) => void
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

  const [stepSelectorState, setStepSelectorState] = useState<{
    isOpen: boolean
    position: { x: number; y: number }
    parentStepName: string | null
    branchIndex?: number
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    parentStepName: null,
    branchIndex: undefined,
  })

  // Temporary React Flow compatibility - no-op functions
  const onNodesChange = useCallback(() => {}, [])
  const onEdgesChange = useCallback(() => {}, [])
  const onConnect = useCallback(() => {}, [])
  const setSelectedNode = useCallback(() => {}, [])
  const setSelectedEdge = useCallback(() => {}, [])

  const clearWorkflow = useCallback(() => {
    setFlowVersion(createInitialFlowVersion())
    setSelectedStep(null)
  }, [])


  const openStepSelectorForStep = useCallback((parentStepName: string, position: { x: number; y: number }, branchIndex?: number) => {
    setStepSelectorState({
      isOpen: true,
      position,
      parentStepName,
      branchIndex,
    })
  }, [])

  const closeStepSelector = useCallback(() => {
    setStepSelectorState({
      isOpen: false,
      position: { x: 0, y: 0 },
      parentStepName: null,
    })
  }, [])

  // Graph-based operations
  const addAction = useCallback((parentStepName: string, action: FlowAction, branchIndex?: number) => {
    setFlowVersion((prev) => {
      // Find the parent step and add the action
      const updateStep = (step: FlowAction | FlowTrigger): FlowAction | FlowTrigger => {
        if (step.name === parentStepName) {
          // If it's a router and we have a branch index, add to that branch
          if (step.type === FlowActionType.ROUTER && branchIndex !== undefined) {
            const routerStep = step as RouterAction
            const newChildren = [...routerStep.children]
            newChildren[branchIndex] = action
            return { ...routerStep, children: newChildren } as RouterAction
          }
          // If it's a loop, add as firstLoopAction
          if (step.type === FlowActionType.LOOP_ON_ITEMS) {
            const loopStep = step as LoopOnItemsAction
            return { ...loopStep, firstLoopAction: action } as LoopOnItemsAction
          }
          // Otherwise add as nextAction
          return { ...step, nextAction: action }
        }
        
        // Recursively search in nextAction
        if ('nextAction' in step && step.nextAction) {
          return { ...step, nextAction: updateStep(step.nextAction) as FlowAction }
        }
        
        // Recursively search in router branches
        if (step.type === FlowActionType.ROUTER) {
          const routerStep = step as RouterAction
          const newChildren = routerStep.children.map((child) => 
            child ? updateStep(child) as FlowAction : child
          )
          return { ...routerStep, children: newChildren } as RouterAction
        }
        
        // Recursively search in loop
        if (step.type === FlowActionType.LOOP_ON_ITEMS) {
          const loopStep = step as LoopOnItemsAction
          if (loopStep.firstLoopAction) {
            return { ...loopStep, firstLoopAction: updateStep(loopStep.firstLoopAction) as FlowAction } as LoopOnItemsAction
          }
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
        
        // Recursively search in nextAction
        if ('nextAction' in step && step.nextAction) {
          return { ...step, nextAction: updateStepRecursive(step.nextAction) as FlowAction }
        }
        
        // Recursively search in router branches
        if (step.type === FlowActionType.ROUTER) {
          const routerStep = step as RouterAction
          const newChildren = routerStep.children.map((child) => 
            child ? updateStepRecursive(child) as FlowAction : child
          )
          return { ...routerStep, children: newChildren } as RouterAction
        }
        
        // Recursively search in loop
        if (step.type === FlowActionType.LOOP_ON_ITEMS) {
          const loopStep = step as LoopOnItemsAction
          const updatedFirstLoopAction = loopStep.firstLoopAction 
            ? updateStepRecursive(loopStep.firstLoopAction) as FlowAction
            : undefined
          return { ...loopStep, firstLoopAction: updatedFirstLoopAction } as LoopOnItemsAction
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
    stepSelectorState,

    // Graph operations
    addAction,
    addTrigger,
    updateStep,
    deleteStep,
    selectStep,
    clearWorkflow,
    openStepSelectorForStep,
    closeStepSelector,

    // Temporary React Flow compatibility
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    setSelectedEdge,
  }

  return <WorkflowContext.Provider value={contextValue}>{children}</WorkflowContext.Provider>
}
