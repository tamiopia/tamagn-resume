import BaseNode from './BaseNode.jsx';
import { ArrowRightToLine } from 'lucide-react';

export const InputNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Input"
    icon={<ArrowRightToLine size={14} />}
    color="#3B82F6"
    inputs={[]}
    outputs={[{ id: 'value', label: 'Value' }]}
    fields={[
      { key: 'inputName', label: 'Name', type: 'text', placeholder: 'input_name', defaultValue: id.replace('customInput-', 'input_') },
      {
        key: 'inputType', label: 'Type', type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
          { value: 'Number', label: 'Number' },
        ],
      },
    ]}
  />
);
