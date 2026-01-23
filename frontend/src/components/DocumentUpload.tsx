import { useState } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

const DocumentUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: "1", name: "Student_Handbook_2024.pdf", size: "2.4 MB", uploadedAt: "2 hours ago" },
    { id: "2", name: "Faculty_Guidelines.docx", size: "1.8 MB", uploadedAt: "1 day ago" },
    { id: "3", name: "Course_Catalog.pdf", size: "3.2 MB", uploadedAt: "3 days ago" },
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const handleFileSelect = () => {
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            name: `Document_${files.length + 1}.pdf`,
            size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
            uploadedAt: "Just now"
          };
          setFiles(prev => [newFile, ...prev]);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">
              Drop files here to upload
            </h3>
            <p className="text-sm text-muted-foreground">
              or click the button below to browse
            </p>
          </div>
          <Button
            onClick={handleFileSelect}
            className="bg-gradient-primary hover:shadow-glow transition-all"
          >
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
          <p className="text-xs text-muted-foreground">
            Supports: PDF, DOC, DOCX, TXT (Max 10MB)
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="font-medium text-foreground">Uploading...</span>
            </div>
            <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Uploaded Files List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Uploaded Documents ({files.length})
        </h3>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-gradient-card border border-border rounded-xl p-4 flex items-center justify-between group hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{file.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {file.size} • {file.uploadedAt}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(file.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;