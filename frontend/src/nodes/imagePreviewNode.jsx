// imagePreviewNode.js
// Image Preview node - demonstrates rich content rendering

import React, { useState } from "react";
import { createNode } from "./nodeFactory";
import { Image } from "lucide-react";
import { NODE_HANDLES } from "./handles";

// Custom ImagePreviewNode component with styled design
const CustomImagePreviewNodeComponent = React.memo(({ id, data }) => {
    const [imageUrl, setImageUrl] = useState(
        data?.imageUrl || "https://placehold.net/1-600x800.png",
    );

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    return (
        <div className="w-44 bg-white p-3 text-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-teal-100 p-1.5 rounded">
                    <Image size={16} className="text-teal-600" />
                </div>
                <h3 className="font-bold text-sm text-gray-800">
                    Image Preview
                </h3>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-3"></div>

            {/* Image Preview Area */}
            <div className="w-full h-16 bg-gray-100 border border-gray-300 rounded mb-3 flex items-center justify-center overflow-hidden">
                <img
                    src={imageUrl}
                    alt="preview"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>

            {/* URL Input */}
            <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Image URL"
                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
            />
        </div>
    );
});

const imageNodeConfig = {
    type: "imagePreview",
    label: "Image Preview",
    handles: NODE_HANDLES.imagePreview,
    fields: [],
    fieldComponents: {},
    color: "image",
    customComponent: CustomImagePreviewNodeComponent,
};

export const ImagePreviewNode = createNode(imageNodeConfig);
