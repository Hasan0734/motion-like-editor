import EditorNav from "./EditorNav";
import Tiptap from "./Tiptap";

const Editor = () => {
  return (
    <div
      className="container w-full mx-auto relative bg-card  shadow-xl rounded-2xl notion-like-editor-wrapper"
    >
      <EditorNav />
      <div className=" h-170 editor-scroll-container overflow-y-scroll scrollbar-none scrollbar-thumb-secondary notion-like-editor-layout">
        <Tiptap />
      </div>
    </div>
  );
};

export default Editor;
