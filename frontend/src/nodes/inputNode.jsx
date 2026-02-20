// inputNode.js
// Input node created with the factory pattern

import { createNode, createHandle, createField } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import useWorkflowStore from "../store/workflowStore";
import { Zap, Settings, Lightbulb } from "lucide-react";
import React from "react";

console.log(FieldComponents);

// Custom InputNode component with styled design
const CustomInputNodeComponent = React.memo(
    ({ id, data, fields, fieldValues, handleFieldChange, fieldComponents }) => {
        return (
            <div className={`w-64 bg-white  p-4 text-sm `}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 p-1.5 rounded">
                        <Zap size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800">
                            Input
                        </h3>
                        <p className="text-xs text-gray-500">
                            Pass data of different types into your workflow
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-3"></div>

                {/* Fields */}
                <div className="space-y-3">
                    {fields.map((field) => {
                        const FieldComponent = fieldComponents[field.type];
                        if (!FieldComponent) return null;

                        const handleChange = (e) => {
                            let value = e.target.value;
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
                            <div key={field.name}>
                                <FieldComponent
                                    label={field.label}
                                    value={fieldValues[field.name]}
                                    onChange={handleChange}
                                    options={field.options}
                                    {...(field.props || {})}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Suggestion Box */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                    <Lightbulb
                        size={16}
                        className="text-blue-500 shrink-0 mt-0.5"
                    />
                    <p className="text-xs text-blue-700">
                        <span className="font-semibold">Suggestion:</span> Give
                        the node a distinct name
                    </p>
                </div>
            </div>
        );
    },
);

const inputNodeConfig = {
    type: "customInput",
    label: "Input",
    handles: {
        targets: [],
        sources: [createHandle("value", "right")],
    },
    fields: [
        createField("TextField", "name", "Name", ""),
        createField("SelectField", "inputType", "Type", "Text", [
            { value: "Text", label: "Text" },
            { value: "File", label: "File" },
        ]),
    ],
    fieldComponents: FieldComponents,
    color: "input",
    customComponent: CustomInputNodeComponent,
    updateStore: (nodeId, fieldName, value) => {
        useWorkflowStore.getState().updateNodeData(nodeId, fieldName, value);
    },
};

export const InputNode = createNode(inputNodeConfig);
