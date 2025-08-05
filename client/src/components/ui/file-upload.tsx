import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function FileUpload({ 
  onUpload, 
  accept = "image/*", 
  className,
  children 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUpload(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      // In a real app, show error toast
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed border-mystic-600 hover:border-celestial-500 rounded-xl p-8 text-center cursor-pointer transition-colors group",
        dragActive && "border-celestial-400 bg-celestial-500/10",
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      {children || (
        <>
          <CloudUpload className="w-12 h-12 mx-auto text-mystic-400 group-hover:text-celestial-400 mb-4" />
          <p className="text-cosmic-300 group-hover:text-cosmic-200">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-cosmic-500 text-sm mt-2">PNG, JPG up to 10MB</p>
        </>
      )}
    </div>
  );
}
