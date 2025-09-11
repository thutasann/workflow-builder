import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflow } from '../context/WorkflowContext';
import { StepSelector } from './StepSelector';
import type { WorkflowNode } from '../types/workflow.types';

export const StepSelectorHandler: React.FC = () => {
  const { setNodes, setEdges, getNodes, getEdges } = useReactFlow();
  const { stepSelectorState, closeStepSelector } = useWorkflow();
  const nodeSpacing = 200; // Same spacing as in App.tsx

  const handleNodeSelect = (option: any) => {
    const { sourceId, targetId } = stepSelectorState;
    if (!sourceId || !targetId) return;

    const newNodeId = `node_${Date.now()}`;
    const currentNodes = getNodes();
    const currentEdges = getEdges();

    // Find source and target nodes
    const sourceNode = currentNodes.find((n) => n.id === sourceId);
    const targetNode = currentNodes.find((n) => n.id === targetId);

    if (!sourceNode || !targetNode) return;

    // Find the edge to replace
    const edgeToReplace = currentEdges.find(
      (e) => e.source === sourceId && e.target === targetId
    );

    setNodes((nodes) => {
      // Create the new node based on selected option
      const newNode: WorkflowNode = {
        id: newNodeId,
        type: option.type,
        position: {
          x: sourceNode.position.x,
          y: (sourceNode.position.y + targetNode.position.y) / 2, // Place between source and target
        },
        data: {
          label: option.label,
          type: option.type,
          stepNumber: '',
          integrationName: option.label,
          integrationLogo: option.integrationLogo,
        },
      };

      // Add the new node to the array
      let updatedNodes = [...nodes, newNode];

      // Sort all nodes by Y position
      updatedNodes.sort((a, b) => a.position.y - b.position.y);

      // Find the trigger node to get the starting position
      const triggerNode = updatedNodes.find((n) => n.type === 'trigger');
      const startY = triggerNode ? triggerNode.position.y : 100;

      // Reposition all nodes with consistent spacing
      let currentY = startY;
      let actionCount = 0;

      updatedNodes = updatedNodes.map((node) => {
        const updatedNode = {
          ...node,
          position: { ...node.position, y: currentY },
        };

        // Update step numbers
        if (node.type === 'trigger') {
          updatedNode.data = { ...node.data, stepNumber: '1' };
        } else if (node.type === 'action' && node.id !== 'end-placeholder') {
          actionCount++;
          updatedNode.data = { ...node.data, stepNumber: `${actionCount + 1}` };
        } else if (node.type === 'router') {
          actionCount++;
          updatedNode.data = { ...node.data, stepNumber: `${actionCount + 1}` };
        }

        // Only increment Y for non-placeholder nodes
        if (node.id !== 'end-placeholder' || updatedNodes.filter((n) => n.id !== 'end-placeholder').length > 1) {
          currentY += nodeSpacing;
        }

        return updatedNode;
      });

      return updatedNodes;
    });

    // Update edges
    setEdges((edges) => {
      const filteredEdges = edges.filter((edge) => edge.id !== edgeToReplace?.id);

      return [
        ...filteredEdges,
        {
          id: `${sourceId}-${newNodeId}`,
          source: sourceId,
          target: newNodeId,
          type: 'custom',
        },
        {
          id: `${newNodeId}-${targetId}`,
          source: newNodeId,
          target: targetId,
          type: 'custom',
        },
      ];
    });

    closeStepSelector();
  };

  return (
    <StepSelector
      isOpen={stepSelectorState.isOpen}
      onClose={closeStepSelector}
      onSelect={handleNodeSelect}
      position={stepSelectorState.position}
    />
  );
};