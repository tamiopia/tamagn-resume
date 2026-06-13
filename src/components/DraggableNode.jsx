// DraggableNode.jsx
import { GripVertical } from "lucide-react";

export const DraggableNode = ({ type, label, icon, color = "#3B82F6", description }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.dataTransfer.setData("application/reactflow", JSON.stringify(appData));
    event.dataTransfer.effectAllowed = "move";
    event.target.style.cursor = "grabbing";
  };

  const onDragEnd = (event) => {
    event.target.style.cursor = "grab";
  };

  return (
    <div
      className="draggable-node"
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={onDragEnd}
      onDoubleClick={() => window.dispatchEvent(new CustomEvent("addNode", { detail: type }))}
      style={{ "--node-color": color }}
    >
      <div
        className="draggable-node__icon"
        style={{ color: color }}
      >
        {icon}
      </div>
      <div className="draggable-node__info">
        <div className="draggable-node__label">{label}</div>
        {description && (
          <div className="draggable-node__desc">{description}</div>
        )}
      </div>
      <div className="draggable-node__drag-hint">
        <GripVertical size={12} />
      </div>
    </div>
  );
};