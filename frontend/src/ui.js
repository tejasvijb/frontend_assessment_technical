// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useRef, useCallback } from "react";
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    useReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
} from "@xyflow/react";

import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";
import  useWorkflowStore  from "./store/workflowStore";
import { useShallow } from "zustand/shallow";

import "@xyflow/react/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
    customInput: InputNode,
    llm: LLMNode,
    customOutput: OutputNode,
    text: TextNode,
};

const workflowSelector = (state) => ({
    getNodeID: state.getNodeID,
});


const PipelineUIInner = () => {
    const reactFlowWrapper = useRef(null);
    const { screenToFlowPosition } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const {getNodeID} = useWorkflowStore(useShallow(workflowSelector));

  
    const onConnect = useCallback(
        (connection) => {
            setEdges((eds) => {
                const newEdges = [
                    ...eds,
                    { ...connection, type: "smoothstep", animated: true },
                ];
                return newEdges;
            });
        },
        [setEdges],
    );

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
                    nodeTypes={nodeTypes}
                    proOptions={proOptions}
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
