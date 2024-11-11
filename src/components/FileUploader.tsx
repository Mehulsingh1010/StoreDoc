"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl, getFileType } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "../components/Thumbnail";
import { MAX_FILE_SIZE } from "../../constants/index";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "../lib/actions/file.actions";
import { usePathname } from "next/navigation";

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

interface FileWithPreview extends File {
  preview?: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const path = usePathname();
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true);

        // Create preview URLs for accepted files
        const filesWithPreviews = acceptedFiles.map(file => 
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );

        setFiles(prev => [...prev, ...filesWithPreviews]);

        const uploadPromises = filesWithPreviews.map(async (file) => {
          if (file.size > MAX_FILE_SIZE) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );

            toast({
              title: "File too large",
              description: `${file.name} is too large. Max file size is 50MB.`,
              variant: "destructive",
            });
            return;
          }

          try {
            const result = await uploadFile({
              file: file as any,
              ownerId,
              accountId,
              path
            });

            if (result) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name !== file.name)
              );
              
              toast({
                title: "Success",
                description: `${file.name} uploaded successfully.`,
              });
            }
          } catch (error) {
            console.error("Upload error:", error);
            toast({
              title: "Upload failed",
              description: `Failed to upload ${file.name}. Please try again.`,
              variant: "destructive",
            });
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Drop error:", error);
        toast({
          title: "Error",
          description: "Something went wrong while processing files.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [ownerId, accountId, path, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      // Add more file types as needed
    },
    multiple: true,
  });

  const handleRemoveFile = useCallback((e: React.MouseEvent, fileName: string) => {
    e.stopPropagation();
    setFiles(prevFiles => {
      const updatedFiles = prevFiles.filter(file => file.name !== fileName);
      // Clean up the preview URL
      const fileToRemove = prevFiles.find(file => file.name === fileName);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updatedFiles;
    });
  }, []);

  // Cleanup preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "cursor-pointer transition-all duration-300",
        isDragActive && "bg-gray-50/50",
        className
      )}
    >
      <input {...getInputProps()} />
      
      <Button 
        type="button" 
        className={cn(
          "uploader-button flex items-center gap-2",
          isUploading && "opacity-50 cursor-not-allowed"
        )}
        disabled={isUploading}
      >
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>{isUploading ? "Uploading..." : "Upload"}</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list mt-4 space-y-2">
          <h4 className="h4 text-light-100">
            {isUploading ? "Uploading" : "Queued Files"}
          </h4>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);

            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={file.preview || convertFileToUrl(file)}
                  />

                  <div className="preview-item-name flex flex-col">
                    <span className="font-medium truncate max-w-[200px]">
                      {file.name}
                    </span>
                    {isUploading && (
                      <Image
                        src="/assets/icons/file-loader.gif"
                        width={80}
                        height={26}
                        alt="Loader"
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleRemoveFile(e, file.name)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt="Remove"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
