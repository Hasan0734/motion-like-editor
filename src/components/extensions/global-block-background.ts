import { Extension } from '@tiptap/core';

export const GlobalBlockBackground = Extension.create({
  name: 'globalBlockBackground',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading', 'bulletList', 'orderedList', 'listItem', 'table', 'tableCell', 'tableRow', 'blockquote'],
        attributes: {
          universalBgColor: {
            default: null,
            parseHTML: element => element.style.backgroundColor || null,
            renderHTML: attributes => {
              if (!attributes.universalBgColor) return {};

              return {
                style: `
                  background-color: ${attributes.universalBgColor};
                  width: 100%;
                  padding: 5px 6px;
                  box-sizing: border-box;
                  border-radius: 4px;
                `.replace(/\s+/g, ' ').trim()
              };
            },
          },
        },
      },
    ];
  },
});
