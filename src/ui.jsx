// ui.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";

import { InputNode }    from "./nodes/inputNode";
import { LLMNode }      from "./nodes/llmNode";
import { OutputNode }   from "./nodes/outputNode";
import { TextNode }     from "./nodes/textNode";
import { PromptNode }   from "./nodes/promptNode";
import { ApiNode }      from "./nodes/apiNode";
import { NoteNode }     from "./nodes/noteNode";
import { MathNode }     from "./nodes/mathNode";
import { ConditionalNode } from "./nodes/conditionalNode";
import { RemovableEdge } from "./edges/RemovableEdge";



import "reactflow/dist/style.css";

const GRID = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  llm:          LLMNode,
  customOutput: OutputNode,
  text:         TextNode,
  prompt:       PromptNode,
  api:          ApiNode,
  note:         NoteNode,
  math:         MathNode,
  conditional:  ConditionalNode,
 
 

};

const edgeTypes = {
  removable: RemovableEdge,
};

const storeSelector = (state) => ({
  nodes:         state.nodes,
  edges:         state.edges,
  getNodeID:     state.getNodeID,
  addNode:       state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onEdgeUpdate:  state.onEdgeUpdate,
  onConnect:     state.onConnect,
  selectNode:    state.selectNode,
  clearSelection:state.clearSelection,
});

export const PipelineUI = () => {
  const wrapperRef        = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onEdgeUpdate,
    onConnect,
    selectNode,
    clearSelection,
  } = useStore(storeSelector, shallow);


  useEffect(() => {
    const handleAddNode = (e) => {
      if (!reactFlowInstance || !wrapperRef.current) return;
      const nodeType = e.detail;
      const rect = wrapperRef.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: rect.width / 2,
        y: rect.height / 2,
      });
      const id = getNodeID(nodeType);
      addNode({ id, type: nodeType, position, data: { id, nodeType } });
    };
    window.addEventListener("addNode", handleAddNode);
    return () => window.removeEventListener("addNode", handleAddNode);
  }, [reactFlowInstance, getNodeID, addNode]);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = wrapperRef.current?.getBoundingClientRect();
      if (!reactFlowBounds || !reactFlowInstance) return;

      const raw = event.dataTransfer?.getData("application/reactflow");
      if (!raw) return;

      const { nodeType } = JSON.parse(raw);
      if (!nodeType) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = getNodeID(nodeType);
      const newNode = {
        id,
        type: nodeType,
        position,
        data: { id, nodeType },
      };

      addNode(newNode);
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onNodeClick = useCallback(
    (_event, node) => selectNode(node.id),
    [selectNode]
  );

  const onPaneClick = useCallback(() => clearSelection(), [clearSelection]);

  return (
    <div className="canvas-wrapper" ref={wrapperRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeUpdate={onEdgeUpdate}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        proOptions={proOptions}
        snapGrid={[GRID, GRID]}
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="var(--border-subtle)" gap={GRID} size={2} />
        <Controls />
        <MiniMap
          nodeColor={(n) => "var(--bg-surface)"}
          maskColor="rgba(13, 15, 18, 0.65)"
        />
      </ReactFlow>
    </div>
  );
};