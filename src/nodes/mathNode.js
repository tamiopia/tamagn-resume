import BaseNode from './BaseNode.jsx';
import { Calculator } from 'lucide-react';

export const MathNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Math"
    icon={<Calculator size={14} />}
    color="#84CC16"
    inputs={[
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ]}
    outputs={[{ id: 'result', label: 'Result' }]}
    fields={[
      {
        key: 'operation', label: 'Operation', type: 'select',
        defaultValue: 'add',
        options: [
          { value: 'add',      label: 'Add (A + B)' },
          { value: 'subtract', label: 'Subtract (A − B)' },
          { value: 'multiply', label: 'Multiply (A × B)' },
          { value: 'divide',   label: 'Divide (A ÷ B)' },
          { value: 'modulo',   label: 'Modulo (A % B)' },
          { value: 'power',    label: 'Power (A ^ B)' },
        ],
      },
    ]}
  />
);
