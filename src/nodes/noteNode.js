import BaseNode from './BaseNode.jsx';
import { StickyNote } from 'lucide-react';

export const NoteNode = ({ id }) => (
  <BaseNode
    id={id}
    title="Note"
    icon={<StickyNote size={14} />}
    color="#F59E0B"
    inputs={[]}
    outputs={[]}
    style={{ background: 'rgba(245,158,11,0.05)', borderColor: 'rgba(245,158,11,0.2)' }}
    fields={[
      { key: 'note', label: 'Note Text', type: 'textarea', placeholder: 'Write a note…', rows: 4, defaultValue: 'Add a note…' },
    ]}
  />
);