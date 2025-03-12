import React, { useState, useCallback } from "react";
import { Upload, X, FileText, AlertCircle, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { cn } from "../../lib/utils";
import { useToast } from "../ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface FileUploadAreaProps {
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in MB
  onFilesUploaded?: (files: File[]) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

const FileUploadArea = ({
  acceptedFileTypes = [".csv", ".xlsx", ".json", ".txt"],
  maxFileSize = 50, // 50MB default
  onFilesUploaded = () => {},
  isUploading = false,
  uploadProgress = 0,
}: FileUploadAreaProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      acceptedFileTypes.length > 0 &&
      !acceptedFileTypes.includes(fileExtension)
    ) {
      return `Invalid file type. Accepted types: ${acceptedFileTypes.join(", ")}`;
    }

    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File too large. Maximum size: ${maxFileSize}MB`;
    }

    return null;
  };

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: File[] = [];
    const newErrors: { [key: string]: string } = {};

    Array.from(selectedFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        newErrors[file.name] = error;
      } else {
        newFiles.push(file);
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setFileErrors(newErrors);
      toast({
        title: "File validation error",
        description:
          "Some files could not be added. Check the error messages below.",
        variant: "destructive",
      });
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      onFilesUploaded(newFiles);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      handleFileChange(droppedFiles);
    },
    [handleFileChange],
  );

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearErrors = () => {
    setFileErrors({});
  };

  return (
    <div className="w-full bg-background p-6 rounded-lg border border-border">
      <h2 className="text-xl font-semibold mb-4">Upload Files</h2>

      {/* Drag & Drop Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20 hover:border-primary/50",
          isUploading ? "pointer-events-none opacity-70" : "",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() =>
          !isUploading && document.getElementById("file-upload")?.click()
        }
      >
        <input
          id="file-upload"
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          accept={acceptedFileTypes.join(",")}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-lg font-medium">Drag & drop files here</p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>

          <div className="text-xs text-muted-foreground">
            <p>Accepted file types: {acceptedFileTypes.join(", ")}</p>
            <p>Maximum file size: {maxFileSize}MB</p>
            <p className="mt-1 text-primary-foreground/70">
              Files will be analyzed automatically after upload
            </p>
          </div>

          <Button variant="outline" className="mt-4" disabled={isUploading}>
            Select Files
          </Button>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove file</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Error Messages */}
      {Object.keys(fileErrors).length > 0 && (
        <div className="mt-6 p-4 border border-destructive/50 bg-destructive/10 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-md font-medium text-destructive">
              File Errors
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 text-xs"
              onClick={clearErrors}
            >
              Clear
            </Button>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {Object.entries(fileErrors).map(([fileName, error]) => (
              <div key={fileName} className="text-sm">
                <span className="font-medium">{fileName}:</span> {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {files.length > 0 &&
        !isUploading &&
        Object.keys(fileErrors).length === 0 && (
          <div className="mt-6 p-4 border border-green-500/50 bg-green-500/10 rounded-md flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-700">
              {files.length} {files.length === 1 ? "file" : "files"} ready for
              processing
            </p>
          </div>
        )}
    </div>
  );
};

export default FileUploadArea;
