import { WorkflowProvider } from './context/WorkflowContext';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import './App.css';

function App() {
  return (
    <WorkflowProvider>
      <WorkflowCanvas />
    </WorkflowProvider>
  );
}

export default App;