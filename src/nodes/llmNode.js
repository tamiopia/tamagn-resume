import BaseNode from './BaseNode.jsx';
import { Sparkles } from 'lucide-react';

export const LLMNode = ({ id }) => (
  <BaseNode
    id={id}
    title="LLM"
    icon={<Sparkles size={14} />}
    color="#8B5CF6"
    inputs={[
      { id: 'system', label: 'System Prompt' },
      { id: 'prompt', label: 'User Prompt' },
    ]}
    outputs={[{ id: 'response', label: 'Response' }]}
    fields={[
      {
        key: 'model', label: 'Model', type: 'select',
        defaultValue: 'gpt-4o',
        options: [
          { value: 'gpt-4o',            label: 'GPT-4o' },
          { value: 'gpt-4-turbo',       label: 'GPT-4 Turbo' },
          { value: 'gpt-3.5-turbo',     label: 'GPT-3.5 Turbo' },
          { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
          { value: 'gemini-1.5-pro',    label: 'Gemini 1.5 Pro' },
        ],
      },
      {
        key: 'apiKey', label: 'API Key', type: 'password',
        placeholder: 'sk-••••••••••••••••',
      },
      {
        key: 'temperature', label: 'Temperature',
        type: 'number', placeholder: '0.7', defaultValue: '0.7',
      },
    ]}
  />
);
