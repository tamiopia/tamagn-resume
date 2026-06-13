import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { Type } from 'lucide-react';
import BaseNode from './BaseNode';
import { useStore } from '../store';

const VARIABLE_RE = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;

const extractVariables = (text) => {
  const matches = [...text.matchAll(VARIABLE_RE)];
  return [...new Set(matches.map((m) => m[1]))];
};

const handleTop = (index, total) =>
  total === 1 ? '50%' : `${((index + 1) / (total + 1)) * 100}%`;

export const TextNode = ({ id }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const text = useStore((s) => {
    const node = s.nodes.find((n) => n.id === id);
    return node?.data?.text ?? '{{input}}';
  });

  const textareaRef = useRef(null);

  const variables = useMemo(() => extractVariables(text), [text]);

  /* Auto-resize height */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${ta.scrollHeight}px`;
  }, [text]);

  /* Dynamic width based on longest line (min 200, max 480) */
  const nodeWidth = useMemo(() => {
    const lines = text.split('\n');
    const longest = Math.max(...lines.map((l) => l.length), 0);
    return Math.min(480, Math.max(200, longest * 7.8 + 72));
  }, [text]);

  const handleChange = useCallback(
    (e) => updateNodeField(id, 'text', e.target.value),
    [id, updateNodeField]
  );

  return (
    <>
      {/* BaseNode handles the shell, delete button, fixed output handle */}
      <BaseNode
        id={id}
        title="Text"
        icon={<Type size={14} />}
        color="#f59e0b"
        inputs={[]}
        outputs={[{ id: 'output', label: 'Output' }]}
        style={{ width: nodeWidth }}
      >
        <div className="node-field">
          <label className="node-field__label">Content</label>
          <textarea
            ref={textareaRef}
            className="node-field__textarea"
            value={text}
            onChange={handleChange}
            placeholder="Enter text… use {{variable}} to create handles"
            rows={3}
          />
        </div>

        {/* Variable badges */}
        {variables.length > 0 && (
          <div className="var-tags">
            {variables.map((v) => (
              <span key={v} className="var-tag">
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        )}
      </BaseNode>

      {/* Dynamic input handles — rendered outside BaseNode to avoid CSS
          conflicts with the accent bar; positioned to overlap the left edge */}
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{ top: handleTop(i, variables.length) }}
          title={varName}
        />
      ))}
    </>
  );
};