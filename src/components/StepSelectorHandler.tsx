import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { useWorkflow } from '../context/WorkflowContext';
import { StepSelector } from './StepSelector';
import type { WorkflowNode, WorkflowEdge } from '../types/workflow.types';
import { calculateBranchPositions, LAYOUT_CONFIG } from '../utils/layoutUtils';

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

    // Check if source is a router node - if so, we need to handle branches
    const isSourceRouter = sourceNode.type === 'router';
    const sourceHandle = stepSelectorState.sourceHandle || edgeToReplace?.sourceHandle;
    const isBranchEdge = edgeToReplace?.type === 'branch' || (isSourceRouter && sourceHandle?.startsWith('branch'));
    const branchId: string | undefined = isBranchEdge ? ((edgeToReplace?.data?.branchId as string | undefined) || `branch_${sourceId}_${Date.now()}`) : undefined;

    setNodes((nodes) => {
      // Determine position based on whether it's a branch
      let nodePosition = { x: sourceNode.position.x, y: 0 };
      
      if (isBranchEdge) {
        // Get branch index from sourceHandle or edge data
        const branchMatch = sourceHandle?.match(/branch-(\d+)/) || 
                           edgeToReplace?.sourceHandle?.match(/branch-(\d+)/);
        const branchIndex = branchMatch ? parseInt(branchMatch[1]) - 1 : 0;
        
        // Find the router node (could be source or ancestor)
        let routerNode = sourceNode.type === 'router' ? sourceNode : null;
        if (!routerNode) {
          // Find router by parentRouterId
          const parentRouterId = (sourceNode.data as any).parentRouterId;
          if (parentRouterId) {
            routerNode = currentNodes.find(n => n.id === parentRouterId);
          }
        }
        
        if (routerNode) {
          // Calculate X position for this branch
          const branchPositions = calculateBranchPositions(routerNode.position.x, 4);
          nodePosition.x = branchPositions[branchIndex];
          nodePosition.y = sourceNode.position.y + LAYOUT_CONFIG.nodeSpacing;
        } else {
          // Fallback to source position
          nodePosition.x = sourceNode.position.x;
          nodePosition.y = sourceNode.position.y + LAYOUT_CONFIG.nodeSpacing;
        }
      } else {
        nodePosition.y = (sourceNode.position.y + targetNode.position.y) / 2;
      }

      // Create the new node based on selected option
      const newNode: WorkflowNode = {
        id: newNodeId,
        type: option.type,
        position: nodePosition,
        data: {
          label: option.label,
          type: option.type,
          stepNumber: '',
          integrationName: option.label,
          integrationLogo: option.integrationLogo,
          branchId: branchId,
          ...(isBranchEdge && sourceNode.type === 'router' ? { parentRouterId: sourceId } : {}),
          ...(isBranchEdge && sourceNode.type !== 'router' && (sourceNode.data as any).parentRouterId ? 
            { parentRouterId: (sourceNode.data as any).parentRouterId } : {}),
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

    // Special handling for when we add a router node
    if (option.type === 'router') {
      // Calculate router position
      const routerX = sourceNode.position.x;
      const routerY = (sourceNode.position.y + targetNode.position.y) / 2;
      
      // Calculate branch positions - 4 branches including "Otherwise"
      const branchCount = 4;
      const branchPositions = calculateBranchPositions(routerX, branchCount);
      const branchY = routerY + LAYOUT_CONFIG.nodeSpacing;
      
      // Create branch placeholder nodes and labels
      const branchPlaceholders: WorkflowNode[] = [];
      const branchLabelNodes: WorkflowNode[] = [];
      const branchEdges: WorkflowEdge[] = [];
      
      const branchLabels = [
        'Add Customer to Sheet',
        'Notify Me on Slack', 
        'Send Email to Customer',
      ];
      
      // Create placeholders and labels for first 3 branches
      for (let i = 0; i < 3; i++) {
        const placeholderId = `branch-${i + 1}-placeholder-${newNodeId}`;
        
        // Create invisible placeholder node for each branch
        branchPlaceholders.push({
          id: placeholderId,
          type: 'action',
          position: { x: branchPositions[i], y: branchY },
          data: {
            label: '',
            type: 'action',
            stepNumber: '',
            branchId: `branch_${newNodeId}_${i + 1}`,
            parentRouterId: newNodeId,
          },
          style: { opacity: 0, pointerEvents: 'none' },
        });
        
        // Create branch label node
        const labelId = `branch-label-${i + 1}-${newNodeId}`;
        branchLabelNodes.push({
          id: labelId,
          type: 'branchLabel',
          position: { x: branchPositions[i], y: routerY + 60 },
          data: {
            label: branchLabels[i],
            type: 'branchLabel',
          },
          draggable: false,
          selectable: false,
          focusable: false,
        });
        
        // Create branch edge without label
        branchEdges.push({
          id: `${newNodeId}-${placeholderId}`,
          source: newNodeId,
          target: placeholderId,
          sourceHandle: `branch-${i + 1}`,
          type: 'branch',
          data: {
            branchId: `branch_${newNodeId}_${i + 1}`,
            branchIndex: i,
          },
        });
      }
      
      // Add Otherwise label node
      const otherwiseLabelId = `branch-label-4-${newNodeId}`;
      const otherwiseLabelNode: WorkflowNode = {
        id: otherwiseLabelId,
        type: 'branchLabel',
        position: { x: branchPositions[3], y: routerY + 60 },
        data: {
          label: 'Otherwise',
          type: 'branchLabel',
        },
        draggable: false,
        selectable: false,
        focusable: false,
      };
      
      // Add 4th branch ("Otherwise") edge directly to end connector
      const otherwiseBranchEdge: WorkflowEdge = {
        id: `${newNodeId}-branch-4-end`,
        source: newNodeId,
        target: `endConnector_${newNodeId}`,
        sourceHandle: 'branch-4',
        type: 'branch',
        data: {
          branchId: `branch_${newNodeId}_4`,
          branchIndex: 3,
          isOtherwiseBranch: true,
        },
      };
      
      // Create end connector
      const endConnectorId = `endConnector_${newNodeId}`;
      const endConnector: WorkflowNode = {
        id: endConnectorId,
        type: 'endConnector',
        position: { 
          x: routerX, 
          y: branchY + LAYOUT_CONFIG.nodeSpacing * 2
        },
        data: {
          label: 'End',
          type: 'endConnector',
          parentRouterId: newNodeId,
        },
      };
      
      // Add all new nodes
      setNodes((prevNodes) => {
        const filtered = prevNodes.filter(n => n.id !== 'end-placeholder');
        return [...filtered, ...branchPlaceholders, ...branchLabelNodes, otherwiseLabelNode, endConnector];
      });
      
      // Update edges - remove edge to end-placeholder and add branch edges
      setEdges((prevEdges) => {
        const filtered = prevEdges.filter((e) => !(e.source === newNodeId && e.target === 'end-placeholder'));
        
        // Add merge edges from placeholders to end connector
        const mergeEdges = branchPlaceholders.map((placeholder, i) => ({
          id: `${placeholder.id}-${endConnectorId}-merge`,
          source: placeholder.id,
          target: endConnectorId,
          targetHandle: `branch-${i + 1}`,
          type: 'merge',
          data: {
            branchId: `branch_${newNodeId}_${i + 1}`,
          },
        }));
        
        // Add edge from end connector to continue flow
        const continueEdge: WorkflowEdge = {
          id: `${endConnectorId}-end-placeholder`,
          source: endConnectorId,
          target: 'end-placeholder',
          type: 'custom',
        };
        
        return [...filtered, ...branchEdges, otherwiseBranchEdge, ...mergeEdges, continueEdge];
      });
    }

    // Update edges
    setEdges((edges) => {
      const filteredEdges = edges.filter((edge) => edge.id !== edgeToReplace?.id);
      
      // Create edges based on whether it's a branch
      const newEdges: WorkflowEdge[] = [
        ...filteredEdges,
        {
          id: `${sourceId}-${newNodeId}`,
          source: sourceId,
          target: newNodeId,
          type: isBranchEdge ? 'branch' : 'custom',
          sourceHandle: sourceHandle,
          data: isBranchEdge ? {
            branchId: branchId,
            branchLabel: sourceHandle ? `Branch ${sourceHandle.replace('branch-', '')}` : '',
            branchIndex: sourceHandle ? parseInt(sourceHandle.replace('branch-', '')) - 1 : 0,
          } : undefined,
        },
        {
          id: `${newNodeId}-${targetId}`,
          source: newNodeId,
          target: targetId,
          type: isBranchEdge ? 'branch' : 'custom',
          data: isBranchEdge && branchId ? {
            branchId: branchId,
          } : undefined,
        },
      ];

      // Find existing end connector for this router
      const endConnectorNode = currentNodes.find(n => 
        n.type === 'endConnector' && 
        ((n.data as any).parentRouterId === (sourceNode.type === 'router' ? sourceId : (sourceNode.data as any).parentRouterId))
      );
      
      // Check if we need to create an end connector
      if (isBranchEdge && !endConnectorNode && sourceNode.type === 'router') {
        const endConnectorId = `endConnector_${sourceId}`;
        const endConnectorNode: WorkflowNode = {
          id: endConnectorId,
          type: 'endConnector',
          position: { 
            x: sourceNode.position.x, 
            y: sourceNode.position.y + LAYOUT_CONFIG.nodeSpacing * 3 
          },
          data: {
            label: 'End',
            type: 'endConnector',
            parentRouterId: sourceId,
          },
        };
        
        // Add end connector node
        setNodes((prevNodes) => {
          const filtered = prevNodes.filter(n => n.id !== 'end-placeholder');
          return [...filtered, endConnectorNode];
        });
        
        // Create edges: branch edge to new node and merge edge from new node to end connector
        const updatedEdges = newEdges.filter(e => e.target !== 'end-placeholder');
        const mergeEdge: WorkflowEdge = {
          id: `${newNodeId}-${endConnectorId}-merge`,
          source: newNodeId,
          target: endConnectorId,
          targetHandle: sourceHandle,
          type: 'merge',
          data: branchId ? {
            branchId: branchId,
          } : undefined,
        };
        
        // Add placeholder edge from end connector
        const placeholderEdge: WorkflowEdge = {
          id: `${endConnectorId}-end-placeholder`,
          source: endConnectorId,
          target: 'end-placeholder',
          type: 'custom',
        };
        
        return [...updatedEdges, mergeEdge, placeholderEdge];
      }
      
      // If we're adding a node in a branch
      if (isBranchEdge && endConnectorNode) {
        // Check if target is a placeholder or end connector
        if (targetNode.style?.opacity === 0 || targetNode.type === 'endConnector') {
          // Remove the direct merge edge from placeholder/previous node to end connector
          const updatedEdges = newEdges.filter(e => 
            !(e.source === sourceId && e.target === endConnectorNode.id && e.type === 'merge')
          );
          
          // Add merge edge from new node to end connector
          const mergeEdge: WorkflowEdge = {
            id: `${newNodeId}-${endConnectorNode.id}-merge`,
            source: newNodeId,
            target: endConnectorNode.id,
            targetHandle: sourceHandle,
            type: 'merge',
            data: branchId ? {
              branchId: branchId,
            } : undefined,
          };
          
          return [...updatedEdges, mergeEdge];
        }
      }

      return newEdges;
    });

    // After the end connector, add edge to continue the main flow
    if (sourceNode.type === 'endConnector' && targetNode.id === 'end-placeholder') {
      // Ensure we maintain the placeholder edge
      const placeholderEdge: WorkflowEdge = {
        id: `${newNodeId}-end-placeholder`,
        source: newNodeId,
        target: 'end-placeholder',
        type: 'custom',
      };
      
      setEdges((edges) => [...edges.filter(e => e.id !== placeholderEdge.id), placeholderEdge]);
    }

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