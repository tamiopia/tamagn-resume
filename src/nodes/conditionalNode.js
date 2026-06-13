import BaseNode from './BaseNode.jsx';
import { GitBranch } from 'lucide-react';

export const ConditionalNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Conditional"
    icon={<GitBranch size={14} />}
    color="#EF4444"
    inputs={[
      { id: 'input', label: 'Input' },
      { id: 'value', label: 'Compare Value' },
    ]}
    outputs={[
      { id: 'true_out',  label: 'True' },
      { id: 'false_out', label: 'False' },
    ]}
    fields={[
      {
        key: 'condition', label: 'Condition', type: 'select',
        defaultValue: 'equals',
        options: [
          { value: 'equals',       label: 'Equals (==)' },
          { value: 'not_equals',   label: 'Not Equals (!=)' },
          { value: 'greater_than', label: 'Greater Than (>)' },
          { value: 'less_than',    label: 'Less Than (<)' },
          { value: 'contains',     label: 'Contains' },
          { value: 'starts_with',  label: 'Starts With' },
          { value: 'is_empty',     label: 'Is Empty' },
        ],
      },
    ]}
  />
);
