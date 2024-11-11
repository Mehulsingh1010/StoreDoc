"use server";

import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../actions/user.action";
import { FileType, TotalSpace, FileTypeInfo, FileDocument, UploadFileProps } from "../../../types/index.s";

const isFileTypeInfo = (value: FileTypeInfo | number): value is FileTypeInfo => {
  return typeof value === 'object' && 'size' in value && 'latestDate' in value;
};

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  try {
    const { storage, databases } = await createAdminClient();

    // Convert file to buffer
    let fileBuffer: Buffer;
    let fileName: string;

    if (file instanceof Buffer) {
      fileBuffer = file;
      fileName = (file as any).name;
    } else if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name;
    } else {
      throw new Error("Invalid file type");
    }

    // Create file in storage
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      InputFile.fromBuffer(fileBuffer, fileName)
    );

    if (!bucketFile?.$id) {
      throw new Error("Failed to create file in storage");
    }

    // Create document
    const fileDocument = {
      type: getFileType(fileName).type as FileType,
      name: fileName,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(fileName).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newFile = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      ID.unique(),
      fileDocument
    ).catch(async (error) => {
      // Clean up storage file if document creation fails
      await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
      throw error;
    });

    revalidatePath(path);
    return parseStringify(newFile);

  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

export async function getTotalSpaceUsed(): Promise<TotalSpace | undefined> {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])]
    );

    const totalSpace: TotalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024 // 2GB available bucket storage
    };

    files.documents.forEach((file: FileDocument) => {
      const fileType = file.type;
      const typeInfo = totalSpace[fileType];
      
      if (isFileTypeInfo(typeInfo)) {
        typeInfo.size += file.size;
        totalSpace.used += file.size;

        if (!typeInfo.latestDate || new Date(file.$updatedAt) > new Date(typeInfo.latestDate)) {
          typeInfo.latestDate = file.$updatedAt;
        }
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used");
    return undefined;
  }
}