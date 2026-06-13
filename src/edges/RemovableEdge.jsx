import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { X } from 'lucide-react';
import { useStore } from '../store';

export const RemovableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = useStore((s) => s.removeEdge);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${targetX - 24}px,${targetY}px)`,
            pointerEvents: 'all',
          }}
          className="edge-button-container"
        >
          <button
            className="edge-delete-btn"
            onClick={(event) => {
              event.stopPropagation();
              removeEdge(id);
            }}
            title="Delete connection"
          >
            <X size={8} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
