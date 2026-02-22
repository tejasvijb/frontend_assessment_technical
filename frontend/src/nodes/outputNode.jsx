// outputNode.js
// Output node created with the factory pattern

import { createNode, createField } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import useWorkflowStore from "../store/workflowStore";
import { NODE_HANDLES } from "./handles";

const outputNodeConfig = {
    type: "customOutput",
    label: "Output",
    handles: NODE_HANDLES.customOutput,
    fields: [
        createField("TextField", "outputName", "Name", "output_1"),
        createField("SelectField", "outputType", "Type", "Text", [
            { value: "Text", label: "Text" },
            { value: "Image", label: "Image" },
        ]),
    ],
    fieldComponents: FieldComponents,
    color: "output",
    updateStore: (nodeId, fieldName, value) => {
        useWorkflowStore.getState().updateNodeData(nodeId, fieldName, value);
    },
};

export const OutputNode = createNode(outputNodeConfig);
