// BaseNode.jsx — Reusable node abstraction for all pipeline nodes
import { memo, useCallback, useState } from "react";
import { Handle, Position } from "reactflow";
import { X, ChevronDown } from "lucide-react";
import { useStore } from "../store";

/**
 * BaseNode – shared layout, styling, handle rendering, and field forms for all node types.
 *
 * @param {string}    id       – ReactFlow node id
 * @param {string}    title    – Node type label shown in header
 * @param {ReactNode} icon     – Lucide icon rendered in header
 * @param {string}    color    – CSS hex color for the accent bar and handles
 * @param {Array}     fields   – [{ key, label, type, options, defaultValue, placeholder, rows }]
 * @param {Array}     inputs   – [{ id, label }] → left-side target handles
 * @param {Array}     outputs  – [{ id, label }] → right-side source handles
 * @param {object}    style    – Extra inline styles on the outer wrapper
 *
 *
 * 
 */
const BaseNode = ({
  id,
  title,
  icon,
  color = "#6366F1",
  fields = [],
  inputs = [],
  outputs = [],
  style = {},
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const removeNode      = useStore((s) => s.removeNode);
  const updateNodeField = useStore((s) => s.updateNodeField);

  const nodeData = useStore((s) => {
    const node = s.nodes.find((n) => n.id === id);
    return node ? node.data : {};
  });

  const invalidNodes = useStore((s) => s.invalidNodes);
  const isInvalid = invalidNodes.includes(id);

  const inputCount  = inputs.length;
  const outputCount = outputs.length;

  const handleTop = (index, total) =>
    total === 1 ? "50%" : `${((index + 1) / (total + 1)) * 100}%`;

  const autoResize = useCallback((el) => {
    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
  }, []);

  const handleFieldChange = useCallback(
    (fieldKey, value) => updateNodeField(id, fieldKey, value),
    [id, updateNodeField]
  );

  const toggleCollapse = useCallback((e) => {
    // only fire on double-click of the header itself (not buttons inside)
    if (e.target.closest("button")) return;
    setCollapsed((c) => !c);
  }, []);

  const nodeClass = `pipeline-node ${isInvalid ? 'pipeline-node--error' : ''}`;

  // ── Collapsed pill ──────────────────────────────────────────────────
  if (collapsed) {
    return (
      <div
        className={`${nodeClass} pipeline-node--collapsed`}
        style={{ "--node-color": color, ...style }}
        onDoubleClick={toggleCollapse}
        title="Double-click to expand"
      >
        {/* Handles still visible so connections work */}
        {inputs.map((input, i) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={`${id}-${input.id}`}
            style={{ top: handleTop(i, inputCount) }}
            title={input.label}
          />
        ))}

        <div className="pipeline-node__pill">
          <div className="pipeline-node__pill-icon">{icon}</div>
          <span className="pipeline-node__pill-title">{title}</span>
          <button
            className="pipeline-node__delete"
            onClick={() => removeNode(id)}
            title="Delete Node"
          >
            <X size={12} />
          </button>
        </div>

        {outputs.map((output, i) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={`${id}-${output.id}`}
            style={{ top: handleTop(i, outputCount) }}
            title={output.label}
          />
        ))}
      </div>
    );
  }

  // ── Expanded (normal) ───────────────────────────────────────────────
  return (
    <div
      className={nodeClass}
      style={{ "--node-color": color, ...style }}
    >
      {/* ── Header (double-click to collapse) ── */}
      <div className="pipeline-node__header" onDoubleClick={toggleCollapse} title="Double-click to collapse">
        <div className="pipeline-node__icon-wrap">{icon}</div>
        <span className="pipeline-node__title">{title}</span>

        {/* Collapse chevron */}
        <button
          className="pipeline-node__collapse"
          onClick={() => setCollapsed(true)}
          title="Collapse node"
        >
          <ChevronDown size={13} />
        </button>

        <button
          className="pipeline-node__delete"
          onClick={() => removeNode(id)}
          title="Delete Node"
        >
          <X size={13} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="pipeline-node__body">
        {children}
        {fields.map((field) => {
          const value = nodeData[field.key] ?? field.defaultValue ?? "";

          if (field.type === "textarea") {
            return (
              <div key={field.key} className="pipeline-node__field">
                <label className="pipeline-node__label">{field.label}</label>
                <textarea
                  className="pipeline-node__textarea"
                  value={value}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 3}
                  onChange={(e) => {
                    handleFieldChange(field.key, e.target.value);
                    autoResize(e.target);
                  }}
                  ref={(el) => {
                    if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; }
                  }}
                />
              </div>
            );
          }

          if (field.type === "select") {
            return (
              <div key={field.key} className="pipeline-node__field">
                <label className="pipeline-node__label">{field.label}</label>
                <select
                  className="pipeline-node__select"
                  value={value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                >
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            );
          }

          // Default: text / password / number
          const inputType = field.type === "password" ? "password"
                          : field.type === "number"   ? "number"
                          : "text";
          return (
            <div key={field.key} className="pipeline-node__field">
              <label className="pipeline-node__label">{field.label}</label>
              <input
                className="pipeline-node__input"
                type={inputType}
                value={value}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step ?? (field.type === "number" ? "any" : undefined)}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>

      {/* ── Input Handles (left) ── */}
      {inputs.map((input, i) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={`${id}-${input.id}`}
          style={{ top: handleTop(i, inputCount) }}
          title={input.label}
        />
      ))}

      {/* ── Output Handles (right) ── */}
      {outputs.map((output, i) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={`${id}-${output.id}`}
          style={{ top: handleTop(i, outputCount) }}
          title={output.label}
        />
      ))}
    </div>
  );
};

export default memo(BaseNode);