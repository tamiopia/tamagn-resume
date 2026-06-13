// NodeDetailsPanel.jsx — Right sidebar showing detailed config for selected node
import { useCallback } from 'react';
import { useStore } from '../store';
import {
  X, ArrowRightToLine, ArrowRightFromLine, Sparkles,
  Type, MessageSquare, Plug, GitBranch, Calculator, StickyNote,
  Settings2, Sliders, Info, Zap,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Node metadata: what extra fields each type has
// ─────────────────────────────────────────────
const NODE_META = {
  customInput: {
    label: 'Input Node',
    icon: <ArrowRightToLine size={18} />,
    color: '#3B82F6',
    description: 'Entry point for data flowing into this pipeline.',
    sections: [
      {
        title: 'Configuration',
        icon: <Settings2 size={13} />,
        fields: [
          { key: 'inputName', label: 'Variable Name', type: 'text', placeholder: 'input_name' },
          {
            key: 'inputType', label: 'Data Type', type: 'select',
            options: [
              { value: 'Text', label: 'Text' },
              { value: 'File', label: 'File' },
              { value: 'Number', label: 'Number' },
              { value: 'Boolean', label: 'Boolean' },
            ],
          },
          { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe this input…', rows: 2 },
        ],
      },
    ],
  },

  customOutput: {
    label: 'Output Node',
    icon: <ArrowRightFromLine size={18} />,
    color: '#10B981',
    description: 'Terminal point — results exit the pipeline here.',
    sections: [
      {
        title: 'Configuration',
        icon: <Settings2 size={13} />,
        fields: [
          { key: 'outputName', label: 'Variable Name', type: 'text', placeholder: 'output_name' },
          {
            key: 'outputType', label: 'Data Type', type: 'select',
            options: [
              { value: 'Text', label: 'Text' },
              { value: 'Image', label: 'Image' },
              { value: 'File', label: 'File' },
              { value: 'Number', label: 'Number' },
            ],
          },
        ],
      },
    ],
  },

  text: {
    label: 'Text Node',
    icon: <Type size={18} />,
    color: '#F59E0B',
    description: 'Static or templated text. Use {{variable}} to create dynamic input handles.',
    sections: [
      {
        title: 'Content',
        icon: <Settings2 size={13} />,
        fields: [
          {
            key: 'text', label: 'Text Content', type: 'textarea',
            placeholder: 'Enter text… use {{variable}} to create input handles.',
            rows: 5,
          },
        ],
      },
    ],
  },

  llm: {
    label: 'LLM Node',
    icon: <Sparkles size={18} />,
    color: '#8B5CF6',
    description: 'Calls a Large Language Model with system and user prompts.',
    sections: [
      {
        title: 'Model',
        icon: <Settings2 size={13} />,
        fields: [
          {
            key: 'model', label: 'Model', type: 'select',
            options: [
              { value: 'gpt-4o', label: 'GPT-4o' },
              { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
              { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
              { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
              { value: 'claude-3-opus', label: 'Claude 3 Opus' },
              { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
              { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
            ],
          },
          {
            key: 'apiKey', label: 'API Key', type: 'password',
            placeholder: 'sk-••••••••••••••••',
          },
        ],
      },
      {
        title: 'Parameters',
        icon: <Sliders size={13} />,
        fields: [
          { key: 'temperature', label: 'Temperature (0–2)', type: 'number', placeholder: '0.7', min: 0, max: 2, step: 0.1 },
          { key: 'maxTokens', label: 'Max Tokens', type: 'number', placeholder: '1024', min: 1, max: 128000 },
          { key: 'topP', label: 'Top P', type: 'number', placeholder: '1.0', min: 0, max: 1, step: 0.05 },
          {
            key: 'responseFormat', label: 'Response Format', type: 'select',
            options: [
              { value: 'text', label: 'Plain Text' },
              { value: 'json', label: 'JSON' },
              { value: 'markdown', label: 'Markdown' },
            ],
          },
        ],
      },
      {
        title: 'Prompts',
        icon: <Zap size={13} />,
        fields: [
          { key: 'systemPrompt', label: 'System Prompt', type: 'textarea', placeholder: 'You are a helpful assistant.', rows: 3 },
        ],
      },
    ],
  },

  prompt: {
    label: 'Prompt Node',
    icon: <MessageSquare size={18} />,
    color: '#EC4899',
    description: 'Builds a structured prompt with role-based sections.',
    sections: [
      {
        title: 'Content',
        icon: <Settings2 size={13} />,
        fields: [
          { key: 'system', label: 'System Message', type: 'textarea', placeholder: 'You are a helpful assistant.', rows: 3 },
          { key: 'user', label: 'User Message', type: 'textarea', placeholder: 'What would you like to know?', rows: 3 },
        ],
      },
    ],
  },

  api: {
    label: 'API Call Node',
    icon: <Plug size={18} />,
    color: '#06B6D4',
    description: 'Makes an HTTP request to an external endpoint.',
    sections: [
      {
        title: 'Request',
        icon: <Settings2 size={13} />,
        fields: [
          {
            key: 'method', label: 'Method', type: 'select',
            options: [
              { value: 'GET', label: 'GET' },
              { value: 'POST', label: 'POST' },
              { value: 'PUT', label: 'PUT' },
              { value: 'PATCH', label: 'PATCH' },
              { value: 'DELETE', label: 'DELETE' },
            ],
          },
          { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
          { key: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{ "Authorization": "Bearer …" }', rows: 3 },
        ],
      },
      {
        title: 'Options',
        icon: <Sliders size={13} />,
        fields: [
          { key: 'timeout', label: 'Timeout (ms)', type: 'number', placeholder: '5000' },
          {
            key: 'contentType', label: 'Content-Type', type: 'select',
            options: [
              { value: 'application/json', label: 'application/json' },
              { value: 'application/x-www-form-urlencoded', label: 'form-urlencoded' },
              { value: 'multipart/form-data', label: 'multipart/form-data' },
            ],
          },
        ],
      },
    ],
  },

  conditional: {
    label: 'Conditional Node',
    icon: <GitBranch size={18} />,
    color: '#EF4444',
    description: 'Routes the pipeline flow based on a condition evaluation.',
    sections: [
      {
        title: 'Condition',
        icon: <Settings2 size={13} />,
        fields: [
          {
            key: 'condition', label: 'Operator', type: 'select',
            options: [
              { value: 'equals', label: 'Equals (==)' },
              { value: 'not_equals', label: 'Not Equals (!=)' },
              { value: 'greater_than', label: 'Greater Than (>)' },
              { value: 'less_than', label: 'Less Than (<)' },
              { value: 'contains', label: 'Contains' },
              { value: 'starts_with', label: 'Starts With' },
              { value: 'is_empty', label: 'Is Empty' },
            ],
          },
          { key: 'compareValue', label: 'Compare Value', type: 'text', placeholder: 'value to compare' },
        ],
      },
    ],
  },

  math: {
    label: 'Math Node',
    icon: <Calculator size={18} />,
    color: '#84CC16',
    description: 'Performs arithmetic between two numeric inputs.',
    sections: [
      {
        title: 'Operation',
        icon: <Settings2 size={13} />,
        fields: [
          {
            key: 'operation', label: 'Operation', type: 'select',
            options: [
              { value: 'add', label: 'Add (A + B)' },
              { value: 'subtract', label: 'Subtract (A − B)' },
              { value: 'multiply', label: 'Multiply (A × B)' },
              { value: 'divide', label: 'Divide (A ÷ B)' },
              { value: 'modulo', label: 'Modulo (A % B)' },
              { value: 'power', label: 'Power (A ^ B)' },
            ],
          },
          { key: 'precision', label: 'Decimal Precision', type: 'number', placeholder: '2', min: 0, max: 20 },
        ],
      },
    ],
  },

  note: {
    label: 'Note',
    icon: <StickyNote size={18} />,
    color: '#F59E0B',
    description: 'A sticky note for annotating your canvas. Not connected to the pipeline.',
    sections: [
      {
        title: 'Content',
        icon: <Settings2 size={13} />,
        fields: [
          { key: 'note', label: 'Note Text', type: 'textarea', placeholder: 'Write a note…', rows: 5 },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────
// Single form field renderer
// ─────────────────────────────────────────────
const PanelField = ({ field, value, onChange }) => {
  const handleChange = (e) => onChange(field.key, e.target.value);

  if (field.type === 'textarea') {
    return (
      <div className="details-field">
        <label className="details-field__label">{field.label}</label>
        <textarea
          className="details-field__textarea"
          value={value ?? ''}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          onChange={handleChange}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="details-field">
        <label className="details-field__label">{field.label}</label>
        <select className="details-field__select" value={value ?? ''} onChange={handleChange}>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className="details-field">
        <label className="details-field__label">{field.label}</label>
        <input
          className="details-field__input"
          type="number"
          value={value ?? ''}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step ?? 'any'}
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="details-field">
      <label className="details-field__label">{field.label}</label>
      <input
        className="details-field__input"
        type={field.type === 'password' ? 'password' : 'text'}
        value={value ?? ''}
        placeholder={field.placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Main panel component
// ─────────────────────────────────────────────
export const NodeDetailsPanel = () => {
  const selectedNodeId  = useStore((s) => s.selectedNodeId);
  const clearSelection  = useStore((s) => s.clearSelection);
  const updateNodeField = useStore((s) => s.updateNodeField);
  const nodeData        = useStore((s) => {
    const node = s.nodes.find((n) => n.id === selectedNodeId);
    return node ? { type: node.type, data: node.data } : null;
  });

  const handleChange = useCallback(
    (key, val) => updateNodeField(selectedNodeId, key, val),
    [selectedNodeId, updateNodeField]
  );

  if (!selectedNodeId || !nodeData) return null;

  const meta = NODE_META[nodeData.type];
  if (!meta) return null;

  return (
    <aside className="details-panel" style={{ '--node-color': meta.color }}>
      {/* Header */}
      <div className="details-panel__header">
        <div className="details-panel__icon" style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 15%, transparent)`, border: `1px solid color-mix(in srgb, ${meta.color} 30%, transparent)` }}>
          {meta.icon}
        </div>
        <div className="details-panel__header-info">
          <div className="details-panel__title">{meta.label}</div>
          <div className="details-panel__id">{selectedNodeId}</div>
        </div>
        <button className="details-panel__close" onClick={clearSelection} title="Close">
          <X size={15} />
        </button>
      </div>

      {/* Description */}
      <div className="details-panel__desc">
        <Info size={12} />
        <span>{meta.description}</span>
      </div>

      {/* Sections */}
      <div className="details-panel__scroll">
        {meta.sections.map((section) => (
          <div key={section.title} className="details-section">
            <div className="details-section__title">
              {section.icon}
              <span>{section.title}</span>
            </div>
            {section.fields.map((field) => (
              <PanelField
                key={field.key}
                field={field}
                value={nodeData.data[field.key]}
                onChange={handleChange}
              />
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
};
