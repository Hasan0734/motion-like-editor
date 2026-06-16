import { EditorContent, useEditor } from "@tiptap/react";
import EditorNav from "./EditorNav";
import { extensions as defaultExtensions } from "./extensions";
import { TocSidebar } from "./toc-sidebar/TocSidebar";
import MyBubbleMenu from "./bubble/MyBubbleMenu";
import Dragable from "./Dragable";
import ImageBubbleMenu from "./bubble/ImageBubbleMenu";

const Editor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: defaultExtensions({
      extensions: [],
      blocks: [],
    }),
    content: `



    <h1>Text editor</h1>
    <br/>
    <p>A text editor is a type of computer program that edits plain text. Such programs are sometimes known as "notepad" software (e.g. Windows Notepad). Text editors are provided with operating systems and software development packages, and can be used to change files such as configuration files, documentation files and programming language source code.</p>
    <br/>
    <h1>Plain text and rich text</h1>
    <br/>
    <p>There are important differences between plain text (created and edited by text editors) and rich text (such as that created by word processors or desktop publishing software).</p>
    <br/>

        <img src="https://placehold.co/600x400" />
    <img src="https://placehold.co/800x400" />
    <p>Plain text exclusively consists of character representation. Each character is represented by a fixed-length sequence of one, two, or four bytes, or as a variable-length sequence of one to four bytes, in accordance to specific character encoding conventions, such as ASCII, ISO/IEC 2022, Shift JIS, UTF-8, or UTF-16. These conventions define many printable characters, but also non-printing characters that control the flow of the text, such as space, line break, and page break. Plain text contains no other information about the text itself, not even the character encoding convention employed. Plain text is stored in text files, although text files do not exclusively store plain text. Since the early days of computers, plain text was (once by necessity and now by convention) generally displayed using a monospace font, such that horizontal alignment and columnar formatting were sometimes done using whitespace characters.</p>
    <br/>
    <p>Rich text, on the other hand, may contain metadata, character formatting data (e.g. typeface, size, weight and style), paragraph formatting data (e.g. indentation, alignment, letter and word distribution, and space between lines or other paragraphs), and page specification data (e.g. size, margin and reading direction). Rich text can be very complex. Rich text can be saved in binary format (e.g. DOC), text files adhering to a markup language (e.g. RTF or HTML), or in a hybrid form of both (e.g. Office Open XML).
    </p>
    <br/>
    <p>Text editors are intended to open and save text files containing either plain text or anything that can be interpreted as plain text, including the markup for rich text or the markup for something else (e.g. SVG).</p>
    <br/>
    <h1>History</h1>
    <br/>
    <p>Before text editors existed, computer text was punched into cards with keypunch machines. Physical boxes of these thin cardboard cards were then inserted into a card reader. Magnetic tape, drum and disk card image files created from such card decks often had no line-separation characters at all, and assumed fixed-length 80- or 90-character records. An alternative to cards was Punched tape. It could be created by some teleprinters (such as the Teletype), which used special characters to indicate ends of records. Some early operating systems included batch text editors, either integrated with language processors or as separate utility programs; one early example was the ability to edit SQUOZE source files for SCAT in SHARE Operating System.</p>
    <br/>
    <p>The first interactive text editors were "line editors" oriented to teleprinter- or typewriter-style terminals without displays. Commands (often a single keystroke) effected edits to a file at an imaginary insertion point called the "cursor". Edits were verified by typing a command to print a small section of the file, and periodically by printing the entire file. In some line editors, the cursor could be moved by commands that specified the line number in the file, text strings (context) for which to search, and eventually regular expressions. Line editors were major improvements over keypunching. Some line editors could be used by keypunch; editing commands could be taken from a deck of cards and applied to a specified file. Some common line editors supported a "verify" mode in which change commands displayed the altered lines.</p>
    <h5>Weird h5 headling</h5>
    <br/>
    <p>When computer terminals with video screens became available, screen-based text editors (sometimes called just "screen editors") became common. One of the earliest full-screen editors was O26, which was written for the operator console of the CDC 6000 series computers in 1967. Another early full-screen editor was vi. Written in the 1970s, it is still a standard editor on Unix and Linux operating systems. Also written in the 1970s was the UCSD Pascal Screen Oriented Editor, which was optimized both for indented source code and general text. Emacs, one of the first free and open-source software projects, is another early full-screen or real-time editor, one that was ported to many systems. A full-screen editor's ease-of-use and speed (compared to the line-based editors) motivated many early purchases of video terminals.</p>
    <br/>
    <h1>Types of text editors</h1>
    <br/>
    <h2>Simple text editors</h2>
    <br/>
    <p>Some text editors are small and simple, while others offer broad and complex functions. For example, Unix and Unix-like operating systems have the pico editor (or a variant), but many also include the vi and Emacs editors. Microsoft Windows systems come with the simple Notepad, though many people—especially programmers—prefer other editors with more features. Under Apple Macintosh's classic Mac OS there was the native TeachText later replaced by SimpleText in 1994, which was replaced in Mac OS X by TextEdit, which combines features of a text editor with those typical of a word processor such as rulers, margins and multiple font selection. These features are not available simultaneously, but must be switched by user command, or through the program automatically determining the file type.</p>
    <br/>
    <h2>Word Editor</h2>
    <br/>
    <p>Most word processors can read and write files in plain text format, allowing them to open files saved from text editors. Saving these files from a word processor, however, requires ensuring the file is written in plain text format, and that any text encoding or BOM settings won't obscure the file for its intended use. Non-WYSIWYG word processors, such as WordStar, are more easily pressed into service as text editors, and in fact were commonly used as such during the 1980s. The default file format of these word processors often resembles a markup language, with the basic format being plain text and visual formatting achieved using non-printing control characters or escape sequences. Later word processors like Microsoft Word store their files in a binary format and are almost never used to edit plain text files.</p>
    <br/>
    <br/>
     <h1 id="introduction">Introduction</h1>
      <p>Welcome to this comprehensive document about table of contents...</p>
      <h2 id="getting-started">Getting Started</h2>
      <p>Let's begin by installing the required packages...</p>
      <h3 id="installation">Installation</h3>
      <p>Run the following command to install...</p>
      <h3 id="configuration">Configuration</h3>
      <p>Configure your editor with these options...</p>
      <h2 id="usage">Usage</h2>
      <p>Here's how to use the TOC components...</p>
      <h3 id="inline-toc">Inline TOC Node</h3>
      <p>Insert a TOC node directly in your document...</p>
      <h3 id="sidebar-toc">Sidebar TOC</h3>
      <p>Add a floating sidebar for navigation...</p>
      <h2 id="advanced">Advanced Features</h2>
      <p>Explore advanced functionality...</p>

    <h2>
      Hi there,
    </h2>
    <p>
      this is a basic <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
    </p>
    <ul>
      <li>
        That’s a bullet list with one …
      </li>
      <li>
        … or two list items.
      </li>
    </ul>
    <p>
      Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
    </p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
    <p>
      I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
    </p>
    <blockquote>
      Wow, that’s amazing. Good work, boy! 👏
      <br />
      — Mom
    </blockquote>
     <h1>Intro Section</h1>
      <p>Type content...</p>
      <div data-type="table-of-contents"></div>
      <h2>Deep Dive Feature</h2>
      <p>More paragraphs...</p>
  `,
    editorProps: {
      attributes: {
        class:
          "prose relative dark:prose-invert prose-hr:border-border prose-blockquote:border-l-foreground prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-pre:bg-popover prose-pre:border prose-pre:border-border prose-pre:text-muted-foreground marker:text-foreground prose-a:text-blue-600 prose-a:hover:text-blue-500 prose-headings:text-inherit focus:outline-none py-10",
      },
    },
  });

  return (
    <div className=" w-full mx-auto relative  notion-like-editor-wrapper">
      <EditorNav editor={editor} />
      <div className="mt-10  notion-like-editor-layout">
        <EditorContent className="notion-like-editor-content" editor={editor} />
        <Dragable editor={editor} />
        <TocSidebar editor={editor} variant="line" />
        <MyBubbleMenu editor={editor} />
        <ImageBubbleMenu editor={editor} onReplaceClick={() => {}} />
      </div>
    </div>
  );
};

export default Editor;

// editor-scroll-container overflow-y-scroll scrollbar-none scrollbar-thumb-secondary
