"use client"

import React, { useCallback } from "react"
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,

  applyEdgeChanges,
  applyNodeChanges
} from "reactflow"


// import { nodes as initialNodes, edges as initialEdges } from "./InitialElements"

import TextUpdaterNode from "./nodes/InputPrompt"
import CustomNode from "./nodes/InputSettings"

import "reactflow/dist/style.css"
import "./page.module.css"

// const nodeTypes = {
//   custom: CustomNode
// }

const initialNodes = [
  {
    id: "node-1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { value: 123 }
  },
  {
    id: "node-2",
    type: "output",
    targetPosition: "top",
    position: { x: 0, y: 200 },
    data: { label: "Prediction 1" }
  },
  {
    id: "node-3",
    type: "output",
    targetPosition: "top",
    position: { x: 200, y: 200 },
    data: { label: "Prediction 2" }
  },
  {
    id: "node-4",
    type: "output",
    targetPosition: "top",
    position: { x: 400, y: 200 },
    data: { label: "Prediction 3" }
  },
  {
    id: "node-5",
    type: "output",
    targetPosition: "left",
    position: { x: 200, y: 5 },
    data: { label: "Settings" }
  },
  {
    id: "node-5",
    type: "output",
    position: { x: 200, y: 5 },
    data: { label: "Settings" }
  }
]

const initialEdges = [
  { id: "edge-1", source: "node-1", target: "node-2", sourceHandle: "b" },
  { id: "edge-2", source: "node-1", target: "node-3", sourceHandle: "b" },
  { id: "edge-3", source: "node-1", target: "node-4", sourceHandle: "b" },
  { id: "edge-4", source: "node-4", target: "node-5", sourceHandle: "b" },
  { id: "edge-5", source: "node-1", target: "node-5", sourceHandle: "c" }

]

// we define the nodeTypes outside of the component to prevent re-renderings
// you could also use useMemo inside the component
const nodeTypes = { textUpdater: TextUpdaterNode, settingsNode: CustomNode }

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance)

const FlowEditor = () => {
  const [nodes, setNodes] = useNodesState(initialNodes)
  const [edges, setEdges] = useEdgesState(initialEdges)

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  )
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  )
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
    >
      {/* <MiniMap style={minimapStyle} zoomable pannable /> */}
      <Controls />
      <Background variant="dots" color="rgba(255,255,255, 0.3)" gap={12} size={2} />
    </ReactFlow>
  )
}


export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FlowEditor />
    </div>
  )
}
