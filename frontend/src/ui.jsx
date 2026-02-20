// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useRef, useCallback, useEffect, useMemo } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    addEdge
} from "@xyflow/react";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import { ImagePreviewNode } from "./nodes/imagePreviewNode";
import useWorkflowStore from "./store/workflowStore";
import { useShallow } from "zustand/shallow";

import "@xyflow/react/dist/style.css";

const gridSize = 20;

// Memoized node types to prevent recreation on each render
const NODE_TYPES = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
    imagePreview: ImagePreviewNode,
};

const workflowSelector = (state) => ({
    getNodeID: state.getNodeID,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
});

const PipelineUIInner = () => {
    const reactFlowWrapper = useRef(null);
    const { screenToFlowPosition } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const {
        getNodeID,
        setNodes: setWorkflowNodes,
        setEdges: setWorkflowEdges,
    } = useWorkflowStore(useShallow(workflowSelector));

    useEffect(() => {
        setWorkflowNodes(nodes);
    }, [nodes, setWorkflowNodes]);

    useEffect(() => {
        setWorkflowEdges(edges);
    }, [edges, setWorkflowEdges]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({...params, animated: true}, eds)), []);

    const getInitNodeData = (nodeID, type) => {
        let nodeData = { id: nodeID, nodeType: `${type}` };
        return nodeData;
    };

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            if (event?.dataTransfer?.getData("application/reactflow")) {
                const appData = JSON.parse(
                    event.dataTransfer.getData("application/reactflow"),
                );
                const type = appData?.nodeType;

                // check if the dropped element is valid
                if (typeof type === "undefined" || !type) {
                    return;
                }

                const position = screenToFlowPosition({
                    x: event.clientX,
                    y: event.clientY,
                });

                const nodeID = getNodeID(type);
                console.log(nodeID);
                const newNode = {
                    id: nodeID,
                    type,
                    position,
                    data: getInitNodeData(nodeID, type),
                };

                setNodes((nds) => nds.concat(newNode));
            }
        },
        [screenToFlowPosition, getNodeID, setNodes],
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    return (
        <>
            <div
                ref={reactFlowWrapper}
                style={{ width: "100wv", height: "70vh" }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={NODE_TYPES}
                    snapGrid={[gridSize, gridSize]}
                    connectionLineType="smoothstep"
                    fitView
                >
                    <Background color="#aaa" gap={gridSize} />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </div>
        </>
    );
};

export const PipelineUI = () => (
    <ReactFlowProvider>
        <PipelineUIInner />
    </ReactFlowProvider>
);
