// textNode.jsx
// Text node with rich text editor and variable mentions support

import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Editor, Transforms, Range, createEditor, node } from "slate";
import { withHistory } from "slate-history";
import {
    Editable,
    ReactEditor,
    Slate,
    useFocused,
    useSelected,
    withReact,
} from "slate-react";
import { createNode, createField } from "./nodeFactory";
import * as FieldComponents from "./fieldComponents";
import { NODE_HANDLES } from "./handles";
import useWorkflowStore from "../store/workflowStore";
import { Portal } from "./slateUtils/Portal";
import { IS_MAC } from "./slateUtils/environment";
import { Type } from "lucide-react";
import { addEdge } from "@xyflow/react";


// Sample variable suggestions for text insertions
// const VARIABLE_SUGGESTIONS = [
//     "firstName",
//     "lastName",
//     "email",
//     "phoneNumber",
//     "address",
//     "companyName",
//     "jobTitle",
//     "department",
// ];

// Custom Text Node Component
const CustomTextNodeComponent = React.memo(
    ({
        id,
        data,
        fields,
        fieldValues,
        handleFieldChange,
        fieldComponents,
        selected,
    }) => {
        const editorRef = useRef(null);
        const editableRef = useRef(null);
        const [target, setTarget] = useState(null);
        const [index, setIndex] = useState(0);
        const [search, setSearch] = useState("");

        const nodes = useWorkflowStore((state) => state.nodes);
        const edges = useWorkflowStore((state) => state.edges);
        const selectedNode = useWorkflowStore((state) => state.selectedNode);
        const setWorkflowEdges = useWorkflowStore((state) => state.setEdges);

        const customInputnodes = useMemo(
            () => nodes.filter((n) => n.type === "customInput"),
            [nodes],
        );

        // console.log('customInputNodes', customInputnodes)

        const customInputValues = useMemo(
            () =>
                customInputnodes.reduce((values, node) => {
                    values.push(node.data?.value || node.id);
                    return values;
                }, []),
            [customInputnodes],
        );

        const renderElement = useCallback(
            (props) => <Element {...props} />,
            [],
        );
        const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

        const editor = useMemo(
            () => withMentions(withReact(withHistory(createEditor()))),
            [],
        );

        // Get filtered suggestions
        const suggestions = customInputValues
            .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
            .slice(0, 8);

        const addNewEdge = (suggestion) => {
            const sourceNode = nodes.find((n) => n.data?.value === suggestion);
            const targetNode = selectedNode;
            if (!sourceNode || !targetNode) return;

            const source = sourceNode.id;
            const target = targetNode.id;
            const sourceHandleId = sourceNode.data.handles.sources[0]?.id || null; // Assuming first handle is the output
            const targetHandleId = targetNode.data.handles.targets[0]?.id || null; // Assuming first handle is the input
            
            const sourceHandle = `${source}-${sourceHandleId}`;
            const targetHandle = `${target}-${targetHandleId}`;

            const edgeId = `xy-edge__${source}${sourceHandle}-${target}${targetHandle}`;

            const newEdge = {
              animated: true,
              id: edgeId,
              source,
              sourceHandle,
              target,
              targetHandle,
            }

            // check if edge already exists
            const edgeExists = edges.some((e) => e.id === edgeId);
            if (edgeExists) return;
            

            const newEdges = addEdge(newEdge, edges);
            setWorkflowEdges(newEdges);

        }

        // Handle mention selection from dropdown or keyboard
        const handleMentionSelection = useCallback(
            (suggestion) => {
                Transforms.select(editor, target);
                insertMention(editor, suggestion);
                addNewEdge(suggestion);
                setTarget(null);
            },
            [editor, target],
        );

        // Handle keyboard navigation in dropdown
        const onKeyDown = useCallback(
            (event) => {
                if (target && suggestions.length > 0) {
                    switch (event.key) {
                        case "ArrowDown":
                            event.preventDefault();
                            const prevIndex =
                                index >= suggestions.length - 1 ? 0 : index + 1;
                            setIndex(prevIndex);
                            break;
                        case "ArrowUp":
                            event.preventDefault();
                            const nextIndex =
                                index <= 0 ? suggestions.length - 1 : index - 1;
                            setIndex(nextIndex);
                            break;
                        case "Tab":
                        case "Enter":
                            event.preventDefault();
                            handleMentionSelection(suggestions[index]);
                            break;
                        case "Escape":
                            event.preventDefault();
                            setTarget(null);
                            break;
                        default:
                            return;
                    }
                }
            },
            [suggestions, editor, index, target, handleMentionSelection],
        );

        // Position the mention dropdown
        useEffect(() => {
            if (target && suggestions.length > 0 && editorRef.current) {
                const el = editorRef.current;
                const domRange = ReactEditor.toDOMRange(editor, target);
                const rect = domRange.getBoundingClientRect();
                el.style.top = `${rect.top + window.pageYOffset + 24}px`;
                el.style.left = `${rect.left + window.pageXOffset}px`;
            }
        }, [suggestions.length, editor, index, search, target]);

        // Auto-focus editor when node is selected
        useEffect(() => {
            if (selected && editableRef.current) {
                // Use a small timeout to ensure DOM is ready
                const timeoutId = setTimeout(() => {
                    ReactEditor.focus(editor);
                    editableRef.current?.focus();
                }, 0);
                return () => clearTimeout(timeoutId);
            }
        }, [selected, editor]);

        // Handle editor content change
        const handleEditorChange = useCallback(() => {
            const { selection } = editor;
            if (selection && Range.isCollapsed(selection)) {
                const [start] = Range.edges(selection);

                // Look back to find {{ pattern
                const before = Editor.before(editor, start, { unit: "block" });
                if (!before) {
                    setTarget(null);
                    return;
                }

                const blockRange = Editor.range(editor, before, start);
                const blockText = Editor.string(editor, blockRange);

                // Match {{ followed by optional word characters at the end
                const match = blockText.match(/\{\{(\w*)$/);

                if (match) {
                    // Get the position where {{ starts
                    const matchPos = blockText.lastIndexOf("{{");
                    const charsBefore = blockText.length - matchPos;

                    // Calculate the target range (from {{ to cursor)
                    const targetStart = Editor.before(editor, start, {
                        distance: charsBefore,
                    });

                    if (targetStart) {
                        const targetRange = Editor.range(
                            editor,
                            targetStart,
                            start,
                        );
                        setTarget(targetRange);
                        setSearch(match[1]); // Extract the search text after {{
                        setIndex(0);
                        return;
                    }
                }
            }
            setTarget(null);
        }, [editor]);

        // Initialize editor value from store data or empty
        const initialValue = useMemo(() => {
            const storedValue = fieldValues.value;
            if (
                storedValue &&
                Array.isArray(storedValue) &&
                storedValue.length > 0
            ) {
                return storedValue;
            }
            return [
                {
                    type: "paragraph",
                    children: [{ text: "" }],
                },
            ];
        }, [fieldValues.value]);

        return (
            <div className="w-80 bg-white p-4 text-sm rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 p-1.5 rounded">
                        <Type size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-gray-800">
                            Text Editor
                        </h3>
                        <p className="text-xs text-gray-500">
                            Rich text with variable support
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-200 mb-3"></div>

                {/* Slate Editor */}
                <Slate
                    editor={editor}
                    initialValue={initialValue}
                    onChange={handleEditorChange}
                >
                    <div className="border border-gray-300 rounded p-2 bg-gray-50 min-h-24 focus-within:border-blue-500 focus-within:shadow-md transition">
                        <Editable
                            ref={editableRef}
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            onKeyDown={onKeyDown}
                            placeholder="Type text here. Use {{ to insert variables..."
                            style={{
                                minHeight: "80px",
                                padding: "8px",
                                outline: "none",
                                fontSize: "14px",
                                lineHeight: "1.5",
                            }}
                        />
                    </div>

                    {/* Variable Dropdown Portal */}
                    {target && suggestions.length > 0 && (
                        <Portal>
                            <div
                                ref={editorRef}
                                style={{
                                    top: "-9999px",
                                    left: "-9999px",
                                    position: "absolute",
                                    zIndex: 50,
                                    padding: "6px",
                                    background: "white",
                                    borderRadius: "6px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                                    minWidth: "150px",
                                    border: "1px solid #e5e7eb",
                                }}
                                data-cy="variable-portal"
                            >
                                {suggestions.map((suggestion, i) => (
                                    <div
                                        key={suggestion}
                                        onClick={() =>
                                            handleMentionSelection(suggestion)
                                        }
                                        style={{
                                            padding: "8px 10px",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            background:
                                                i === index
                                                    ? "#dbeafe"
                                                    : "transparent",
                                            color:
                                                i === index
                                                    ? "#1e40af"
                                                    : "#1f2937",
                                            fontSize: "13px",
                                            fontWeight:
                                                i === index ? "500" : "400",
                                            transition: "background 0.1s",
                                        }}
                                        onMouseEnter={() => setIndex(i)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        </Portal>
                    )}
                </Slate>

                {/* Info Box */}
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                    <span className="font-semibold">Tip:</span> Type {"{{"} to
                    insert a variable
                </div>
            </div>
        );
    },
);

CustomTextNodeComponent.displayName = "CustomTextNodeComponent";

// Leaf component for text formatting
const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
        children = <em>{children}</em>;
    }
    if (leaf.underline) {
        children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
};

// Element component for rendering different element types
const Element = (props) => {
    const { attributes, children, element } = props;
    switch (element.type) {
        case "mention":
            return <Mention {...props} />;
        default:
            return <p {...attributes}>{children}</p>;
    }
};

// Mention element renderer
const Mention = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();
    const style = {
        padding: "3px 6px",
        margin: "0 2px",
        verticalAlign: "baseline",
        display: "inline-block",
        borderRadius: "4px",
        backgroundColor: "#dbeafe",
        fontSize: "0.95em",
        fontWeight: "500",
        color: "#1e40af",
        boxShadow: selected && focused ? "0 0 0 2px #60a5fa" : "none",
        border: selected && focused ? "1px solid #3b82f6" : "none",
    };

    return (
        <span
            {...attributes}
            contentEditable={false}
            data-cy={`variable-${element.character.replace(/\s+/g, "-")}`}
            style={style}
        >
            <div contentEditable={false}>
                {element.character}
                {children}
            </div>
        </span>
    );
};

// Editor plugin for mentions support
const withMentions = (editor) => {
    const { isInline, isVoid, markableVoid } = editor;

    editor.isInline = (element) => {
        return element.type === "mention" ? true : isInline(element);
    };

    editor.isVoid = (element) => {
        return element.type === "mention" ? true : isVoid(element);
    };

    editor.markableVoid = (element) => {
        return element.type === "mention" || markableVoid(element);
    };

    return editor;
};

// Insert variable into editor
const insertMention = (editor, character) => {
    const mention = {
        type: "mention",
        character,
        children: [{ text: "" }],
    };
    console.log("mention", mention);
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
};

// Node configuration for the factory pattern
const textNodeConfig = {
    type: "text",
    label: "Text",
    handles: NODE_HANDLES.text,
    fieldComponents: FieldComponents,
    color: "text",
    customComponent: CustomTextNodeComponent,
    updateStore: (nodeId, fieldName, value) => {
        useWorkflowStore.getState().updateNodeData(nodeId, fieldName, value);
    },
};

export const TextNode = createNode(textNodeConfig);
