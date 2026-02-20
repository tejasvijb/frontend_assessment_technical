// toolbar.js

import { DraggableNode } from "./draggableNode";
import { Download, Zap, Upload, Type, Image } from "lucide-react";

export const PipelineToolbar = () => {
    const nodes = [
        { type: "customInput", label: "Input", icon: Download },
        { type: "llm", label: "LLM", icon: Zap },
        { type: "customOutput", label: "Output", icon: Upload },
        { type: "text", label: "Text", icon: Type },
        { type: "imagePreview", label: "Image Preview", icon: Image },
    ];

    return (
        <div className="p-6">
            <div className="flex flex-wrap gap-4">
                {nodes.map((node) => (
                    <DraggableNode
                        key={node.type}
                        type={node.type}
                        label={node.label}
                        icon={node.icon}
                    />
                ))}
            </div>
        </div>
    );
};
