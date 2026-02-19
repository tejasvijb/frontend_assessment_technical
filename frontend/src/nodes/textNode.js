// textNode.js
// Text node created with the factory pattern

import { createNode, createHandle, createField } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import useWorkflowStore from "../store/workflowStore";

const textNodeConfig = {
    type: "text",
    label: "Text",
    handles: {
        targets: [],
        sources: [createHandle("output", "right")],
    },
    fields: [
        createField("TextAreaField", "text", "Text", "{{input}}", null, { rows: 2 }),
    ],
    fieldComponents: FieldComponents,
    color: "text",
    updateStore: (nodeId, fieldName, value) => {
        useWorkflowStore.getState().updateNodeData(nodeId, fieldName, value);
    },
};

export const TextNode = createNode(textNodeConfig);
