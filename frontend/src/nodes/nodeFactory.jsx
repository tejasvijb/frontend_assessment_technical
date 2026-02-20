// nodeFactory.js
// Factory function to create node components from configuration

import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { DEFAULT_STYLE, DEFAULT_NODE_COLORS } from "./nodeConstants";

/**
 * createNode - Factory function that creates a node component from a configuration object
 *
 * @param {Object} config - Node configuration with the following structure:
 *   {
 *     type: string,                    // Unique node type identifier
 *     label: string,                   // Display label for the node
 *     handles: {                       // Handle configuration
 *       targets: Array<{id, position, label?, top?}>,  // Input handles
 *       sources: Array<{id, position, label?, top?}>   // Output handles
 *     },
 *     fields: Array<{                  // Input fields configuration
 *       type: string,                  // Field type (text, select, radio, slider, etc)
 *       name: string,                  // State key name
 *       label: string,                 // Display label
 *       defaultValue: any,             // Default value
 *       options?: Array<{value, label}>, // For select/radio fields
 *       props?: Object                 // Additional field-specific props
 *     }>,
 *     fieldComponents: Object,         // Map of field type to component
 *     styling?: Object,                // Override default styling
 *     color?: string,                  // Background color key
 *     updateStore?: Function           // Callback to persist state to store (id, fieldName, value)
 *     children?: React components or render function for custom node content
 *   }
 *
 * Returns: React functional component
 */
export function createNode(config) {
    const {
        label,
        handles = { targets: [], sources: [] },
        fields = [],
        fieldComponents = {},
        styling = {},
        color = "input",
        customComponent: CustomComponent = null,
        updateStore = null,
        width = null,
        height = null,
    } = config;

    const finalStyle = {
        ...DEFAULT_STYLE,
        backgroundColor:
            DEFAULT_NODE_COLORS[color] || DEFAULT_NODE_COLORS.input,
        ...styling,
    };

    const NodeComponent = ({ id, data, selected }) => {
        // Initialize state from data or use defaults
        const [fieldValues, setFieldValues] = useState(() => {
            const initial = {};
            fields.forEach((field) => {
                initial[field.name] = data?.[field.name] ?? field.defaultValue;
            });
            return initial;
        });

        // Handle field changes
        const handleFieldChange = (fieldName, newValue) => {
            setFieldValues((prev) => ({
                ...prev,
                [fieldName]: newValue,
            }));

            // Persist to store if callback provided
            if (updateStore) {
                updateStore(id, fieldName, newValue);
            }
        };

        // Render handle
        const renderHandle = (handleConfig, nodeId, index, handlesList) => {
            const position =
                handleConfig.position === "left"
                    ? Position.Left
                    : handleConfig.position === "right"
                      ? Position.Right
                      : handleConfig.position === "top"
                        ? Position.Top
                        : Position.Bottom;

            const handleType = handlesList.targets.includes(handleConfig)
                ? "target"
                : "source";
            const style = handleConfig.top ? { top: handleConfig.top } : {};

            return (
                <Handle
                    key={`${nodeId}-${handleConfig.id}`}
                    type={handleType}
                    position={position}
                    id={`${nodeId}-${handleConfig.id}`}
                    style={style}
                />
            );
        };

        // If custom component provided, use it
        if (CustomComponent) {
            return (
                <div
                    className={`p-3 rounded-md border-2 ${
                        selected ? "border-blue-500" : "border-gray-100"
                    } `}
                >
                    {/* Render target handles (inputs) */}
                    {handles.targets.map((h, idx) =>
                        renderHandle(h, id, idx, handles),
                    )}

                    {/* Custom component */}
                    <CustomComponent
                        id={id}
                        data={data}
                        fields={fields}
                        fieldValues={fieldValues}
                        handleFieldChange={handleFieldChange}
                        fieldComponents={fieldComponents}
                        selected={selected}
                    />

                    {/* Render source handles (outputs) */}
                    {handles.sources.map((h, idx) =>
                        renderHandle(h, id, idx, handles),
                    )}
                </div>
            );
        }

        // Render a single field based on its type
        const renderField = (field) => {
            const FieldComponent = fieldComponents[field.type];

            if (!FieldComponent) {
                console.warn(`No component for field type: ${field.type}`);
                return null;
            }

            const handleChange = (e) => {
                let value = e.target.value;
                // Handle different input types
                if (e.target.type === "checkbox") {
                    value = e.target.checked;
                } else if (e.target.type === "number") {
                    value = parseFloat(value);
                } else if (e.target.type === "range") {
                    value = parseFloat(value);
                }
                handleFieldChange(field.name, value);
            };

            return (
                <FieldComponent
                    key={field.name}
                    label={field.label}
                    value={fieldValues[field.name]}
                    onChange={handleChange}
                    options={field.options}
                    {...(field.props || {})}
                />
            );
        };

        return (
            <div
                
                className={`p-3 bg-white rounded-md border-2 ${
                    selected ? "border-blue-500" : "border-gray-100"
                } ${width || "w-64"} ${height || "h-auto"}`}
            >
                {/* Render target handles (inputs) */}
                {handles.targets.map((h, idx) =>
                    renderHandle(h, id, idx, handles),
                )}

                {/* Node header/label */}
                <div className="font-bold mb-1.5 text-xs">{label}</div>

                {/* Render fields */}
                <div className="text-xs">{fields.map(renderField)}</div>

                {/* Render source handles (outputs) */}
                {handles.sources.map((h, idx) =>
                    renderHandle(h, id, idx, handles),
                )}
            </div>
        );
    };

    NodeComponent.displayName = `Node(${label})`;

    return React.memo(NodeComponent);
}

/**
 * Helper function to create a handle config object
 */
export function createHandle(id, position, label = null, top = null) {
    return { id, position, label, ...(top ? { top } : {}) };
}

/**
 * Helper function to create a field config object
 */
export function createField(
    type,
    name,
    label,
    defaultValue = "",
    options = null,
    props = {},
) {
    return {
        type,
        name,
        label,
        defaultValue,
        ...(options ? { options } : {}),
        props,
    };
}
