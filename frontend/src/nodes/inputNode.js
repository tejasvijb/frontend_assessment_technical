// inputNode.js
// Input node created with the factory pattern

import { createNode, createHandle, createField } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import useWorkflowStore from "../store/workflowStore";

console.log(FieldComponents);

const inputNodeConfig = {
    type: "customInput",
    label: "Input",
    handles: {
        targets: [],
        sources: [createHandle("value", "right")],
    },
    fields: [
        createField("TextField", "inputName", "Name", "input_1"),
        createField("SelectField", "inputType", "Type", "Text", [
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
        ]),
    ],
    fieldComponents: FieldComponents,
    color: "input",
    updateStore: (nodeId, fieldName, value) => {
        useWorkflowStore.getState().updateNodeData(nodeId, fieldName, value);
    },
};

export const InputNode = createNode(inputNodeConfig);
