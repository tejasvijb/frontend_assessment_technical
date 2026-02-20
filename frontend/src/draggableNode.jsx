// draggableNode.js

export const DraggableNode = ({ type, label, icon: Icon }) => {
    const onDragStart = (event, nodeType) => {
        const appData = { nodeType };
        event.target.style.cursor = "grabbing";
        event.dataTransfer.setData(
            "application/reactflow",
            JSON.stringify(appData),
        );
        event.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            onDragStart={(event) => onDragStart(event, type)}
            onDragEnd={(event) => (event.target.style.cursor = "grab")}
            draggable
            className="flex flex-col items-center justify-center gap-2 w-24 px-4 py-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-grab active:cursor-grabbing"
        >
            {Icon && <Icon size={24} className="text-gray-700" />}
            <span className="text-xs text-center text-gray-700 font-medium">
                {label}
            </span>
        </div>
    );
};
