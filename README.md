# React Workflow Builder

A visual workflow automation builder inspired by ActivePieces, built with React, TypeScript, and React Flow (@xyflow/react).

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-12.3-purple)
![Vite](https://img.shields.io/badge/Vite-6.0-yellow)

## 🚀 Features

- **ActivePieces-Inspired Architecture** - Graph-based workflow representation with recursive building
- **Visual Workflow Creation** - Drag-free interface with automatic node alignment
- **Smart Edge Controls** - Inline plus buttons for easy node insertion via step selector popup
- **Router Support** - Create branching workflows with conditional logic
- **Automatic Graph Layout** - Vertical alignment with proper spacing and offset calculations
- **Step Selector Popup** - Beautiful UI for selecting from various integrations and actions
- **TypeScript Support** - Full type safety with enums and strict typing
- **Graph-Based State** - Efficient workflow representation using FlowVersion and ApGraph structures

## 🏗️ Project Structure

```
workflow/
├── src/
│   ├── components/         # React components
│   │   ├── nodes/         # ActivePieces-style node components
│   │   │   ├── ApStepNode.tsx        # Main workflow step node
│   │   │   ├── ApBigAddButtonNode.tsx # Large add button for branches
│   │   │   └── ApGraphEndNode.tsx    # Graph end widget
│   │   ├── edges/         # Custom edge components
│   │   │   ├── ApStraightLineEdge.tsx # Straight edges with add buttons
│   │   │   └── CustomEdge.tsx        # Legacy edge (minimal)
│   │   ├── WorkflowCanvas.tsx        # Main canvas with React Flow
│   │   ├── WorkflowHeader.tsx        # Header with flow name
│   │   ├── StepSelector.tsx         # Step selector popup UI
│   │   └── StepSelectorHandler.tsx  # Step selector logic
│   ├── context/           # State management
│   │   └── WorkflowContext.tsx      # Graph-based workflow state
│   ├── types/             # TypeScript definitions
│   │   └── workflow.types.ts        # ActivePieces-style types
│   ├── utils/            # Utility functions
│   │   ├── graphUtils.ts           # Graph building and manipulation
│   │   ├── flowConstants.ts       # Constants and dimensions
│   │   ├── reactFlowConverter.ts  # ApGraph to React Flow converter
│   │   └── cn.ts                 # className utility
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── docs/                  # Documentation
│   ├── README.md         # Docs overview
│   ├── activepieces-analysis.md # ActivePieces implementation notes
│   └── screenshots/      # UI reference images
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd workflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📖 Documentation

- [Documentation Index](./docs/README.md) - All documentation
- [ActivePieces Analysis](./docs/activepieces-analysis.md) - Implementation patterns from ActivePieces

## 💻 Basic Usage

```typescript
import { useWorkflow } from './context/WorkflowContext'
import { FlowActionType } from './types/workflow.types'

function MyWorkflow() {
  const { flowVersion, addAction, openStepSelectorForStep } = useWorkflow()

  // Add a new action to the workflow
  const handleAddAction = () => {
    const newAction = {
      name: `step-${Date.now()}`,
      displayName: 'Send Email',
      type: FlowActionType.PIECE,
      settings: {
        pieceName: 'gmail',
        actionName: 'send-email',
      },
    }
    
    // Add after the trigger
    addAction('trigger', newAction)
  }

  // Or open the step selector popup
  const handleOpenSelector = () => {
    openStepSelectorForStep('trigger', { x: 500, y: 300 })
  }

  return <WorkflowCanvas />
}
```

## 🎯 Core Concepts

### ActivePieces Architecture

1. **Graph-Based State** - Workflows are represented as FlowVersion with recursive graph structure
2. **Node Types**:
   - `ApStepNode` - Represents triggers and actions in the workflow
   - `ApBigAddButtonNode` - Large add button for empty branches
   - `ApGraphEndNode` - Invisible end widget for graph calculations
3. **Edge Types**:
   - `ApStraightLineEdge` - Straight lines with inline add buttons
4. **Flow Actions**:
   - `CODE` - Custom code execution
   - `PIECE` - Integration actions (Gmail, Slack, etc.)
   - `ROUTER` - Conditional branching
   - `LOOP_ON_ITEMS` - Loop operations

### Graph Building Process

1. **Recursive Construction** - Each step builds its own graph and child graphs
2. **Automatic Positioning** - Nodes positioned with proper offsets and spacing
3. **Branch Management** - Router nodes create multiple branches with proper layout
4. **Edge Creation** - Automatic edge generation between sequential steps

### Workflow Rules

- Every workflow starts with one trigger
- Nodes are positioned at x=400px with automatic vertical spacing
- Add new steps via the plus button on edges
- Router nodes create 4 branches (3 conditional + 1 otherwise)
- Graph end widgets manage proper flow termination

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run type-check # Run TypeScript compiler
```

### Key Technologies

- **React 18.3** - UI framework
- **TypeScript 5.6** - Type safety
- **@xyflow/react 12.3** - Flow visualization
- **Vite 6.0** - Build tooling
- **Context API** - State management

## 🙏 Acknowledgments

- Inspired by [ActivePieces](https://www.activepieces.com/)
- Built with [React Flow](https://reactflow.dev/)
- Icons from [Simple Icons](https://simpleicons.org/)

## 📞 Support

- 📧 Email: your-email@example.com
- 💬 Discord: [Join our community](#)
- 📚 Documentation: [View full docs](./docs)

---

Made with ❤️ by Thuta
