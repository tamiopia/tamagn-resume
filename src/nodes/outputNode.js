import BaseNode from './BaseNode.jsx';
import { ArrowRightFromLine } from 'lucide-react';

export const OutputNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Output"
    icon={<ArrowRightFromLine size={14} />}
    color="#10B981"
    inputs={[{ id: 'value', label: 'Value' }]}
    outputs={[]}
    fields={[
      { key: 'outputName', label: 'Name', type: 'text', placeholder: 'output_name', defaultValue: id.replace('customOutput-', 'output_') },
      {
        key: 'outputType', label: 'Type', type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
          { value: 'File', label: 'File' },
        ],
      },
    ]}
  />
);
