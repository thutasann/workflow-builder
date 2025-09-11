import { useEffect } from 'react';
import { WorkflowProvider } from './context/WorkflowContext';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { useWorkflow } from './context/WorkflowContext';
import './App.css';

const WorkflowBuilder: React.FC = () => {
  const { addNode, onConnect } = useWorkflow();

  useEffect(() => {
    // Center X position for all nodes
    const centerX = 400;
    const nodeSpacing = 150;
    const startY = 100;

    // Add initial trigger and action nodes
    addNode({
      id: 'trigger-1',
      type: 'trigger',
      position: { x: centerX, y: startY },
      data: {
        label: 'New Message Post...',
        type: 'trigger',
        integrationName: 'Slack',
        integrationLogo: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
      },
    });

    addNode({
      id: 'action-1',
      type: 'action',
      position: { x: centerX, y: startY + nodeSpacing },
      data: {
        label: 'Create Database Item...',
        type: 'action',
        stepNumber: '2',
        integrationName: 'Notion',
        integrationLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
      },
    });

    addNode({
      id: 'action-2',
      type: 'action',
      position: { x: centerX, y: startY + nodeSpacing * 2 },
      data: {
        label: 'Get Card',
        type: 'action',
        stepNumber: '3',
        integrationName: 'Trello',
        integrationLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Trello_logo.svg',
      },
    });

    // Add edges to connect nodes
    onConnect({ source: 'trigger-1', target: 'action-1', sourceHandle: null, targetHandle: null });
    onConnect({ source: 'action-1', target: 'action-2', sourceHandle: null, targetHandle: null });
  }, [addNode, onConnect]);

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
