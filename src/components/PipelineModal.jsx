// PipelineModal.jsx
import { useState, useRef, useEffect } from "react";
import { CheckCircle2, AlertCircle, GitMerge, XCircle } from "lucide-react";

export const PipelineModal = ({ result, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!result) return null;

  const { num_nodes, num_edges, is_dag } = result;

  const handlePointerDown = (e) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e) => {
    if (isDragging.current) {
      isDragging.current = false;
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal" 
        onClick={(e) => e.stopPropagation()}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      >
        {/* Header (Drag Handle) */}
        <div 
          className="modal__header modal__header--draggable"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="modal__icon">
            <AlertCircle size={20} color="#6366F1" />
          </div>
          <div>
            <div className="modal__title">Pipeline Analysis</div>
            <div className="modal__subtitle">Validation results from backend</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="modal__stats">
          <div className="modal__stat">
            <div className="modal__stat-label">Nodes</div>
            <div className="modal__stat-value">{num_nodes ?? 0}</div>
          </div>
          <div className="modal__stat">
            <div className="modal__stat-label">Edges</div>
            <div className="modal__stat-value">{num_edges ?? 0}</div>
          </div>
        </div>

        {/* DAG status */}
        <div className="modal__dag">
          <div className="modal__dag-icon">
            {is_dag ? (
              <CheckCircle2 size={20} color="#10B981" />
            ) : (
              <XCircle size={20} color="#EF4444" />
            )}
          </div>
          <div>
            <div className="modal__dag-title">
              {is_dag ? "Valid DAG" : "Cycle Detected"}
            </div>
            <div className="modal__dag-desc">
              {is_dag
                ? "Data flows in one direction without loops."
                : "Pipeline contains a circular dependency."}
            </div>
          </div>
        </div>

        {/* Cycle Nodes Warning */}
        {!is_dag && result.cycle_nodes && result.cycle_nodes.length > 0 && (
          <div className="modal__cycle">
            <div className="modal__cycle-title">Nodes involved in cycle:</div>
            <div className="modal__cycle-nodes">
              {result.cycle_nodes.join(" → ")}
            </div>
          </div>
        )}

        <button className="modal__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};