// Storage utilities
// Handles file uploads and management in Firebase Storage

import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './init';
import { STORAGE_PATHS } from './config';

// Type definitions
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Upload vehicle images
export const uploadVehicleImages = async (
  uid: string,
  files: File[],
  onProgress?: (progress: UploadProgress) => void
): Promise<string[]> => {
  try {
    const urls: string[] = [];
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    let uploadedSize = 0;

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} is not a valid image file`);
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`${file.name} exceeds 5MB size limit`);
      }

      const storageRef = ref(
        storage,
        `${STORAGE_PATHS.VEHICLE_IMAGES}/${uid}/${Date.now()}-${file.name}`
      );

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);

      uploadedSize += file.size;
      if (onProgress) {
        onProgress({
          loaded: uploadedSize,
          total: totalSize,
          percentage: Math.round((uploadedSize / totalSize) * 100),
        });
      }
    }

    return urls;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload images');
  }
};

// Upload user avatar
export const uploadUserAvatar = async (uid: string, file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('File exceeds 2MB size limit');
    }

    const storageRef = ref(storage, `${STORAGE_PATHS.USER_AVATARS}/${uid}/avatar`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload avatar');
  }
};

// Upload chat attachment
export const uploadChatAttachment = async (
  uid: string,
  chatId: string,
  file: File
): Promise<string> => {
  try {
    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('File exceeds 20MB size limit');
    }

    const storageRef = ref(
      storage,
      `${STORAGE_PATHS.CHAT_ATTACHMENTS}/${uid}/${chatId}/${Date.now()}-${file.name}`
    );

    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upload attachment');
  }
};

// Delete file from storage
export const deleteStorageFile = async (fileUrl: string): Promise<void> => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete file');
  }
};

// Delete user's files
export const deleteUserFiles = async (uid: string, path: string): Promise<void> => {
  try {
    const folderRef = ref(storage, `${path}/${uid}`);
    const files = await listAll(folderRef);

    for (const file of files.items) {
      await deleteObject(file);
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to delete user files');
  }
};

// Validate image dimensions
export const validateImageDimensions = (
  file: File,
  minWidth: number = 400,
  minHeight: number = 300,
  maxWidth: number = 4000,
  maxHeight: number = 4000
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const isValid =
          img.width >= minWidth &&
          img.height >= minHeight &&
          img.width <= maxWidth &&
          img.height <= maxHeight;

        if (isValid) {
          resolve(true);
        } else {
          reject(
            new Error(
              `Image dimensions must be between ${minWidth}x${minHeight} and ${maxWidth}x${maxHeight}`
            )
          );
        }
      };

      img.onerror = () => {
        reject(new Error('Invalid image file'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Compress image before upload
export const compressImage = (
  file: File,
  quality: number = 0.7,
  maxWidth: number = 1920,
  maxHeight: number = 1440
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};
