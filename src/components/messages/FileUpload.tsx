import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, File, Image as ImageIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

type FileUploadProps = {
    onUploadComplete: (files: UploadedFile[]) => void;
    maxFiles?: number;
    maxSize?: number; // in bytes
};

export type UploadedFile = {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
};

export function FileUpload({ onUploadComplete, maxFiles = 5, maxSize = 10 * 1024 * 1024 }: FileUploadProps) {
    const { toast } = useToast();
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Filter files by size
        const validFiles = acceptedFiles.filter((file) => {
            if (file.size > maxSize) {
                toast({
                    title: "File too large",
                    description: `${file.name} exceeds ${maxSize / (1024 * 1024)}MB limit`,
                    variant: "destructive",
                });
                return false;
            }
            return true;
        });

        setFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));
    }, [maxFiles, maxSize, toast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/zip': ['.zip'],
            'text/plain': ['.txt'],
        },
    });

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            const uploadedFiles: UploadedFile[] = [];

            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const response = await api.post('/files/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const progress = progressEvent.total
                            ? Math.round(((i + progressEvent.loaded / progressEvent.total) / files.length) * 100)
                            : 0;
                        setUploadProgress(progress);
                    },
                });

                uploadedFiles.push(response.data.file);
            }

            onUploadComplete(uploadedFiles);
            setFiles([]);
            setUploadProgress(0);

            toast({
                title: "Upload successful",
                description: `${uploadedFiles.length} file(s) uploaded successfully`,
            });
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.response?.data?.message || "Failed to upload files",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return <ImageIcon className="w-5 h-5" />;
        if (file.type === 'application/pdf') return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
            >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                {isDragActive ? (
                    <p className="text-sm text-primary">Drop files here...</p>
                ) : (
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Max {maxFiles} files, {maxSize / (1024 * 1024)}MB each
                        </p>
                    </div>
                )}
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50"
                        >
                            {getFileIcon(file)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFile(index)}
                                disabled={uploading}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}

                    {/* Upload Progress */}
                    {uploading && (
                        <div className="space-y-2">
                            <Progress value={uploadProgress} />
                            <p className="text-xs text-center text-muted-foreground">
                                Uploading... {uploadProgress}%
                            </p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <Button
                        className="w-full"
                        onClick={handleUpload}
                        disabled={uploading || files.length === 0}
                    >
                        {uploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
                    </Button>
                </div>
            )}
        </div>
    );
}
