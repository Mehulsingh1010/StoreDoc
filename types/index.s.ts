/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { Models } from "node-appwrite";

// Define the missing SegmentParams interface
interface SegmentParams {
  // Add properties as needed for your segment parameters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// File related types
export type FileType = "document" | "image" | "video" | "audio" | "other";

// Action related interfaces
export interface ActionType {
  label: string;
  icon: string;
  value: string;
}

// Search and Navigation related interfaces
export interface SearchParamProps {
  params?: Promise<SegmentParams>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}

export interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

// File operation interfaces
export interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

export interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}

export interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}

export interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}

export interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

// UI Component interfaces
export interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

export interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

export interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}