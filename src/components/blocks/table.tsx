import type { BlockItem } from './types';
import { Table } from 'lucide-react';

export const table: BlockItem = {
  title: 'Table',
  description: 'Add a call to action button to email.',
  searchTerms: ['table', 'row', 'cell'],
  icon: <Table  />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).insertTable().run();
  },
};
