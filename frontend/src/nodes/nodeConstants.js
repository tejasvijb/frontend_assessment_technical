// nodeConstants.js
// Shared constants for all node types

export const DEFAULT_STYLE = {
    width: 200,
    height: 80,
    border: "1px solid black",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
};

export const HANDLE_POSITIONS = {
    DEFAULT_LEFT_RIGHT: {
        targets: [{ id: "value", position: "left", label: null }],
        sources: [{ id: "value", position: "right", label: null }],
    },
    DUAL_INPUT_SINGLE_OUTPUT: {
        targets: [
            { id: "input1", position: "left", label: null, top: "33%" },
            { id: "input2", position: "left", label: null, top: "67%" },
        ],
        sources: [{ id: "output", position: "right", label: null }],
    },
    INPUT_ONLY: {
        targets: [],
        sources: [{ id: "value", position: "right", label: null }],
    },
    OUTPUT_ONLY: {
        targets: [{ id: "value", position: "left", label: null }],
        sources: [],
    },
};

export const FIELD_TYPES = {
    TEXT: "text",
    SELECT: "select",
    RADIO: "radio",
    SLIDER: "slider",
    FILE: "file",
    TEXTAREA: "textarea",
};

export const DEFAULT_NODE_COLORS = {
    input: "#e8f5e9",
    output: "#fce4ec",
    llm: "#e3f2fd",
    text: "#fff3e0",
    csv: "#f3e5f5",
    image: "#e0f2f1",
    json: "#fbe9e7",
    slider: "#f1f8e9",
    api: "#ede7f6",
};

export const FIELD_STYLES = {
    label: {
        display: "block",
        marginTop: "4px",
        marginBottom: "2px",
        fontSize: "11px",
        fontWeight: "bold",
    },
    input: {
        width: "100%",
        padding: "4px",
        fontSize: "11px",
        border: "1px solid #ccc",
        borderRadius: "2px",
        boxSizing: "border-box",
    },
    select: {
        width: "100%",
        padding: "4px",
        fontSize: "11px",
        border: "1px solid #ccc",
        borderRadius: "2px",
        boxSizing: "border-box",
    },
};
