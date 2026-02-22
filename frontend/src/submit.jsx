import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import useWorkflowStore from "./store/workflowStore";

export const SubmitButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    const { nodes, edges } = useWorkflowStore();

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                nodes: nodes.map((node) => ({ id: node.id })),
                edges: edges.map((edge) => ({
                    source: edge.source,
                    target: edge.target,
                })),
            };

            const res = await fetch(`${BACKEND_URL}/pipelines/parse`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to parse pipeline");
            }

            const data = await res.json();
            setResponse(data);
            setIsOpen(true);
        } catch (err) {
            setError(err.message);
            setIsOpen(true);
        } finally {
            setLoading(false);
        }
    };

    function close() {
        setIsOpen(false);
    }

    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>

            <Dialog
                open={isOpen}
                as="div"
                className="relative z-10 focus:outline-none"
                onClose={close}
            >
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/50">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                            transition
                            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
                        >
                            <DialogTitle
                                as="h3"
                                className="text-base font-semibold text-gray-900"
                            >
                                Pipeline Analysis
                            </DialogTitle>

                            {error ? (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
                                    <p className="font-medium">Error</p>
                                    <p className="text-sm mt-1">{error}</p>
                                </div>
                            ) : response ? (
                                <div className="mt-4 space-y-3">
                                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            Number of Nodes
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {response.num_nodes}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded border border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            Number of Edges
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {response.num_edges}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded border ${response.is_dag ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                                    >
                                        <p className="text-sm text-gray-600">
                                            Valid DAG
                                        </p>
                                        <p
                                            className={`text-2xl font-bold ${response.is_dag ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {response.is_dag ? "✓ Yes" : "✗ No"}
                                        </p>
                                    </div>
                                </div>
                            ) : null}

                            <div className="mt-6">
                                <Button
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none"
                                    onClick={close}
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
};
