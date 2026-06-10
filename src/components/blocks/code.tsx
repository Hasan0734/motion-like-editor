import { CodeXmlIcon } from 'lucide-react';
import { BlockItem } from './types';

export const htmlCodeBlock: BlockItem = {
  title: 'Code Block',
  description: 'Insert a custom HTML block',
  searchTerms: ['html', 'code', 'custom'],
  icon: <CodeXmlIcon  />,
  command: ({ editor, range }) => {
    // @ts-ignore
    editor
      .chain()
      .focus()
      .deleteRange(range)
      // @ts-ignore
      .setHtmlCodeBlock({ language: 'html' })
      .run();
  },
};
