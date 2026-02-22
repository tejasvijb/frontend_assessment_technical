import { createHandle } from "../nodeFactory";

export const NODE_HANDLES = {
  imagePreview: {
    targets: [createHandle("image", "left")],
    sources: [createHandle("output", "right")],
  },
  customInput: {
    targets: [],
    sources: [createHandle("value", "right")],
  },
  text: {
    targets: [createHandle("textArea", "left")],
    sources: [createHandle("output", "right")],
  },
  customOutput: {
    targets: [createHandle("value", "left")],
    sources: [],
  },
  llm: {
    targets: [
      createHandle("system", "left", null, "33%"),
      createHandle("prompt", "left", null, "67%"),
    ],
    sources: [createHandle("response", "right")],
  },
};