// llmNode.js
// LLM node created with the factory pattern

import { createNode } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import { NODE_HANDLES } from "./handles";

const llmNodeConfig = {
    type: "llm",
    label: "LLM",
    handles: NODE_HANDLES.llm,
    fields: [],
    fieldComponents: FieldComponents,
    color: "llm",
    width: "w-64",
    height: "h-40",
};

export const LLMNode = createNode(llmNodeConfig);
