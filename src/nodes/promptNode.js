import BaseNode from './BaseNode.jsx';
import { MessageSquare } from 'lucide-react';

export const PromptNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Prompt"
    icon={<MessageSquare size={14} />}
    color="#EC4899"
    inputs={[{ id: 'context', label: 'Context' }]}
    outputs={[{ id: 'prompt', label: 'Prompt' }]}
    fields={[
      { key: 'system', label: 'System Message', type: 'textarea', placeholder: 'You are a helpful assistant.', rows: 2, defaultValue: 'You are a helpful assistant.' },
      { key: 'user', label: 'User Message', type: 'textarea', placeholder: 'What would you like to ask?', rows: 2 },
    ]}
  />
);
