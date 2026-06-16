import { CloudUploadIcon, File, FileImage } from "lucide-react";

export const DropZoneContent: React.FC<{ maxSize: number; limit: number }> = ({
  maxSize,
  limit,
}) => (
  <>
    <div className="tiptap-image-upload-dropzone">
      {/* <File size={50} className="tiptap-image-upload-dropzone-rect-primary" /> */}
      <FileImage size={50} className="tiptap-image-upload-dropzone-rect-primary" />
      <div className="tiptap-image-upload-icon-container">
        <CloudUploadIcon className="tiptap-image-upload-icon" />
      </div>
    </div>

    <div className="tiptap-image-upload-content">
      <span className="tiptap-image-upload-text">
        <em>Click to upload</em> or drag and drop
      </span>
      <span className="tiptap-image-upload-subtext">
        Maximum {limit} file{limit === 1 ? "" : "s"}, {maxSize / 1024 / 1024}MB
        each.
      </span>
    </div>
  </>
);
