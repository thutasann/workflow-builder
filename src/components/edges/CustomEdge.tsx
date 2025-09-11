import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getStraightPath,
  useReactFlow,
} from '@xyflow/react';

export const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) => {
  const { setNodes, setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const handleAddNode = () => {
    const newNodeId = `node_${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'action',
      position: {
        x: labelX - 100,
        y: labelY - 30,
      },
      data: {
        label: 'New Action',
        type: 'action' as const,
        stepNumber: 'step_new',
      },
    };

    setNodes((nodes) => [...nodes, newNode]);
    
    setEdges((edges) => {
      const filteredEdges = edges.filter((edge) => edge.id !== id);
      const sourceNodeId = edges.find((edge) => edge.id === id)?.source || '';
      const targetNodeId = edges.find((edge) => edge.id === id)?.target || '';
      
      return [
        ...filteredEdges,
        {
          id: `${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          type: 'custom',
        },
        {
          id: `${newNodeId}-${targetNodeId}`,
          source: newNodeId,
          target: targetNodeId,
          type: 'custom',
        },
      ];
    });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            className="edge-button"
            onClick={handleAddNode}
            style={{
              width: '28px',
              height: '28px',
              background: '#9ca3af',
              border: '3px solid #f3f4f6',
              borderRadius: '6px',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6b7280';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#9ca3af';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            +
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};