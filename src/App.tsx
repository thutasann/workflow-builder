import { useEffect, useState } from 'react';
import { WorkflowProvider } from './context/WorkflowContext';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { useWorkflow } from './context/WorkflowContext';
import './App.css';

const WorkflowBuilder: React.FC = () => {
  const { nodes, addNode, onConnect } = useWorkflow();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only add nodes once
    if (isInitialized || nodes.some(n => n.id === 'trigger-1')) return;

    // Center X position for all nodes
    const centerX = 400;
    const nodeSpacing = 200;
    const startY = 100;

    // Add initial trigger node only
    addNode({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: centerX, y: startY },
      data: {
        label: 'New Message Post...',
        type: 'trigger',
        integrationName: 'Slack',
        integrationLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
        stepNumber: '1',
      },
    });

    // Add a placeholder end node for visual continuity
    addNode({
      id: 'end-placeholder',
      type: 'action',
      position: { x: centerX, y: startY + nodeSpacing },
      data: {
        label: '',
        type: 'action',
        stepNumber: '',
      },
      style: { opacity: 0, pointerEvents: 'none' },
    });

    // Add edge from trigger to placeholder
    onConnect({ source: 'trigger-1', target: 'end-placeholder', sourceHandle: null, targetHandle: null });
    
    setIsInitialized(true);
  }, [isInitialized, nodes, addNode, onConnect]);

  return <WorkflowCanvas />;
};

function App() {
  return (
    <WorkflowProvider>
      <WorkflowBuilder />
    </WorkflowProvider>
  );
}

export default App;
