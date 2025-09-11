# React Workflow Builder

A visual workflow automation builder inspired by ActivePieces, built with React, TypeScript, and React Flow (@xyflow/react).

![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React Flow](https://img.shields.io/badge/React%20Flow-12.3-purple)
![Vite](https://img.shields.io/badge/Vite-6.0-yellow)

## 🚀 Features

- **Visual Workflow Creation** - Drag-free interface with automatic node alignment
- **Custom Node Types** - Trigger and Action nodes with integration support
- **Smart Edge Controls** - Inline plus buttons for easy node insertion
- **Automatic Layout** - Vertical alignment with consistent 200px spacing
- **Step Numbering** - Automatic sequential numbering for workflow steps
- **TypeScript Support** - Full type safety and IntelliSense
- **State Management** - Context API for global workflow state

## 🏗️ Project Structure

```
workflow/
├── src/
│   ├── components/         # React components
│   │   ├── nodes/         # Custom node components
│   │   │   ├── TriggerNode.tsx
│   │   │   └── ActionNode.tsx
│   │   ├── edges/         # Custom edge components
│   │   │   └── CustomEdge.tsx
│   │   ├── WorkflowCanvas.tsx
│   │   └── WorkflowHeader.tsx
│   ├── context/           # State management
│   │   └── WorkflowContext.tsx
│   ├── types/             # TypeScript definitions
│   │   └── workflow.types.ts
│   ├── App.tsx           # Main application
│   └── main.tsx          # Entry point
├── docs/                  # Documentation
│   ├── README.md         # Docs overview
│   ├── GETTING_STARTED.md
│   ├── ARCHITECTURE.md
│   └── API.md
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

- [Getting Started Guide](./docs/GETTING_STARTED.md) - Quick start and examples
- [Architecture Overview](./docs/ARCHITECTURE.md) - System design and patterns
- [API Reference](./docs/API.md) - Complete API documentation
- [Documentation Index](./docs/README.md) - All documentation

## 💻 Basic Usage

```typescript
import { useWorkflow } from './context/WorkflowContext'

function MyWorkflow() {
  const { nodes, edges, addNode, onConnect } = useWorkflow()

  // Add a new action node
  const handleAddAction = () => {
    addNode({
      id: `action-${Date.now()}`,
      type: 'action',
      position: { x: 400, y: 300 },
      data: {
        label: 'Send Email',
        type: 'action',
        stepNumber: '2',
        integrationName: 'Gmail',
      },
    })
  }

  return <WorkflowCanvas />
}
```

## 🎯 Core Concepts

### Node Types

1. **Trigger Nodes** - Starting points (webhooks, schedules, events)
2. **Action Nodes** - Operations (API calls, database operations)

### Workflow Rules

- Every workflow starts with one trigger
- Nodes are non-draggable for clean organization
- Automatic vertical alignment at x=400px
- 200px spacing between nodes
- Step numbers update automatically

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
