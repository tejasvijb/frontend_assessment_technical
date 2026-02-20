import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";

const MAX_LOGS_PER_NODE = 100;

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useWorkflowStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    selectedNode: null,
    nodeStates: new Map(),
    workflowId: undefined,
    executionStartTime: undefined,
    isExecuting: false,
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    // Graph manipulation
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },
    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },
    onConnect: (connection) => {
        set({
            edges: addEdge(connection, get().edges),
        });
    },

    setSelectedNode: (node) => {
        set({ selectedNode: node });
    },

    // Node ID generation
    getNodeID: (type) => {
        const newIDs = { ...get().nodeIDs };
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({ nodeIDs: newIDs });
        return `${type}_${newIDs[type]}`;
    },

    // Add node to graph
    addNode: (node) => {
        set({
            nodes: [...get().nodes, node],
        });
    },

    // Execution state management
    updateNodeState: (nodeId, update) => {
        const currentStates = new Map(get().nodeStates);
        const currentState = currentStates.get(nodeId) || {
            status: "idle",
            timestamp: Date.now(),
            logs: [],
        };

        // Merge updates, handling logs carefully to maintain max size
        const newState = {
            ...currentState,
            ...update,
            timestamp: Date.now(),
        };

        // Truncate logs to MAX_LOGS_PER_NODE
        if (newState.logs && newState.logs.length > MAX_LOGS_PER_NODE) {
            newState.logs = newState.logs.slice(-MAX_LOGS_PER_NODE);
        }

        currentStates.set(nodeId, newState);
        set({ nodeStates: currentStates });
    },

    batchUpdateNodeStates: (updates) => {
        const currentStates = new Map(get().nodeStates);
        const now = Date.now();

        updates.forEach((update) => {
            const { nodeId, ...stateUpdate } = update;
            const currentState = currentStates.get(nodeId) || {
                status: "idle",
                timestamp: now,
                logs: [],
            };

            const newState = {
                ...currentState,
                ...stateUpdate,
                timestamp: stateUpdate.timestamp || now,
            };

            // Truncate logs to MAX_LOGS_PER_NODE
            if (newState.logs && newState.logs.length > MAX_LOGS_PER_NODE) {
                newState.logs = newState.logs.slice(-MAX_LOGS_PER_NODE);
            }

            currentStates.set(nodeId, newState);
        });

        set({ nodeStates: currentStates });
    },

    getNodeState: (nodeId) => {
        return get().nodeStates.get(nodeId);
    },

    resetNodeStates: () => {
        set({ nodeStates: new Map() });
    },

    setWorkflowId: (id) => {
        set({ workflowId: id });
    },

    setIsExecuting: (executing) => {
        set({ isExecuting: executing });
    },

    setExecutionStartTime: (time) => {
        set({ executionStartTime: time });
    },

    // Update node data and persist to store
    updateNodeData: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [fieldName]: fieldValue,
                        },
                    };
                }
                return node;
            }),
        });
    },
}));

export default useWorkflowStore;
