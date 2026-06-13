import BaseNode from './BaseNode.jsx';
import { Plug } from 'lucide-react';

export const ApiNode = ({ id }) => (
  <BaseNode
    id={id}
    title="API Call"
    icon={<Plug size={14} />}
    color="#06B6D4"
    inputs={[{ id: 'body', label: 'Request Body' }]}
    outputs={[
      { id: 'response', label: 'Response' },
      { id: 'status', label: 'Status Code' },
    ]}
    fields={[
      {
        key: 'method', label: 'Method', type: 'select',
        defaultValue: 'GET',
        options: [
          { value: 'GET',    label: 'GET' },
          { value: 'POST',   label: 'POST' },
          { value: 'PUT',    label: 'PUT' },
          { value: 'PATCH',  label: 'PATCH' },
          { value: 'DELETE', label: 'DELETE' },
        ],
      },
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://api.example.com/endpoint' },
    ]}
  />
);
