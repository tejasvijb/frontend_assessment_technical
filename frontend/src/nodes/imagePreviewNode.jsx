// imagePreviewNode.js
// Image Preview node - demonstrates rich content rendering

import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { DEFAULT_STYLE, DEFAULT_NODE_COLORS } from "./nodeConstants";

export const ImagePreviewNode = ({ id, data }) => {
    const [imageUrl, setImageUrl] = useState(
        data?.imageUrl ||
            "https://placehold.net/1-600x800.png",
    );

    const handleImageUrlChange = (e) => {
        setImageUrl(e.target.value);
    };

    return (
        <div
            style={{
                ...DEFAULT_STYLE,
                backgroundColor: DEFAULT_NODE_COLORS.image,
                width: 180,
                height: 140,
            }}
        >
            <Handle type="target" position={Position.Left} id={`${id}-image`} />
            <div
                style={{
                    fontWeight: "bold",
                    marginBottom: "4px",
                    fontSize: "12px",
                }}
            >
                Image Preview
            </div>
            <div
                style={{
                    width: "100%",
                    height: "60px",
                    backgroundColor: "#f0f0f0",
                    border: "1px solid #ddd",
                    borderRadius: "2px",
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                }}
            >
                <img
                    src={imageUrl}
                    alt="preview"
                    style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                    }}
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>
            <input
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Image URL"
                style={{
                    width: "100%",
                    padding: "2px",
                    fontSize: "9px",
                    border: "1px solid #ccc",
                    borderRadius: "2px",
                    boxSizing: "border-box",
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id={`${id}-output`}
            />
        </div>
    );
};
