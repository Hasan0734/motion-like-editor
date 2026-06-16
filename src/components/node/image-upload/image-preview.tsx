import { CloudUploadIcon, XIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FileItem } from "./types";

interface ImageUploadPreviewProps {
  /**
   * The file item to preview
   */
  fileItem: FileItem;
  /**
   * Callback to remove this file from upload queue
   */
  onRemove: () => void;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  fileItem,
  onRemove,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="tiptap-image-upload-preview">
      {fileItem.status === "uploading" && (
        <div
          className="tiptap-image-upload-progress"
          style={{ width: `${fileItem.progress}%` }}
        />
      )}

      <div className="tiptap-image-upload-preview-content">
        <div className="tiptap-image-upload-file-info">
          <div className="tiptap-image-upload-file-icon">
            <CloudUploadIcon />
          </div>
          <div className="tiptap-image-upload-details">
            <span className="tiptap-image-upload-text">
              {fileItem.file.name}
            </span>
            <span className="tiptap-image-upload-subtext">
              {formatFileSize(fileItem.file.size)}
            </span>
          </div>
        </div>
        <div className="tiptap-image-upload-actions">
          {fileItem.status === "uploading" && (
            <span className="tiptap-image-upload-progress-text">
              {fileItem.progress}%
            </span>
          )}
          <Button
            size={"icon"}
            type="button"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <XIcon className="tiptap-button-icon" />
          </Button>
        </div>
      </div>
    </div>
  );
};
