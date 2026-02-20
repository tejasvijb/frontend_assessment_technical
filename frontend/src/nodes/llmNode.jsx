// llmNode.js
// LLM node created with the factory pattern

import { createNode, createHandle } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";

const llmNodeConfig = {
    type: "llm",
    label: "LLM",
    handles: {
        targets: [
            createHandle("system", "left", null, "33%"),
            createHandle("prompt", "left", null, "67%"),
        ],
        sources: [createHandle("response", "right")],
    },
    fields: [],
    fieldComponents: FieldComponents,
    color: "llm",
    width: "w-64",
    height: "h-40"
};

export const LLMNode = createNode(llmNodeConfig);
