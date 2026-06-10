import type { BlockItem } from './types';
import { SmilePlus } from 'lucide-react';

export const emoji: BlockItem = {
  title: 'Emoji',
  description: 'Add a emoji to make it look good.',
  searchTerms: ['emoji'],
  icon: <SmilePlus  />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor.chain().focus().deleteRange(range).insertContent(':').run();
  },
};
