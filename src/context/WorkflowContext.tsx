import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { WorkflowNode, WorkflowEdge, WorkflowState } from '../types/workflow.types';

interface WorkflowContextType {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: WorkflowNode) => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setSelectedEdge: (edgeId: string | null) => void;
  clearWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [state, setState] = useState<WorkflowState>({
    nodes: [],
    edges: [],
    selectedNode: null,
    selectedEdge: null,
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setState((state) => ({
        ...state,
        nodes: applyNodeChanges(changes, state.nodes) as WorkflowNode[],
      }));
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setState((state) => ({
        ...state,
        edges: applyEdgeChanges(changes, state.edges) as WorkflowEdge[],
      }));
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setState((state) => {
        // Check if edge already exists
        const edgeExists = state.edges.some(
          edge => edge.source === connection.source && edge.target === connection.target
        );
        if (edgeExists) {
          return state; // Don't add duplicate edge
        }
        
        // Create edge with custom type
        const newEdge = {
          ...connection,
          id: `${connection.source}-${connection.target}`,
          type: 'custom',
        } as WorkflowEdge;
        
        return {
          ...state,
          edges: [...state.edges, newEdge],
        };
      });
    },
    []
  );

  const addNode = useCallback((node: WorkflowNode) => {
    setState((state) => {
      // Check if node with this ID already exists
      if (state.nodes.some(n => n.id === node.id)) {
        return state; // Don't add duplicate
      }
      return {
        ...state,
        nodes: [...state.nodes, node],
      };
    });
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setState((state) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setState((state) => ({
      ...state,
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    }));
  }, []);

  const setSelectedNode = useCallback((nodeId: string | null) => {
    setState((state) => ({
      ...state,
      selectedNode: nodeId,
    }));
  }, []);

  const setSelectedEdge = useCallback((edgeId: string | null) => {
    setState((state) => ({
      ...state,
      selectedEdge: edgeId,
    }));
  }, []);

  const clearWorkflow = useCallback(() => {
    setState({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
    });
  }, []);

  const contextValue: WorkflowContextType = {
    nodes: state.nodes,
    edges: state.edges,
    selectedNode: state.selectedNode,
    selectedEdge: state.selectedEdge,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    deleteNode,
    setSelectedNode,
    setSelectedEdge,
    clearWorkflow,
  };

  return (
    <WorkflowContext.Provider value={contextValue}>
      {children}
    </WorkflowContext.Provider>
  );
};