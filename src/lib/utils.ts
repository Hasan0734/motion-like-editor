import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const uploadFile = async (file: File, onProgress?: (event: { progress: number }) => void, signal?: AbortSignal) => {
  const formData = new FormData();
  formData.append('file', file);

  // Note: standard fetch cannot track upload progress
  // const response = await fetch('https://example.com', {
  //   method: 'POST',
  //   body: formData,
  //   signal: signal, // Handles cancellation
  // });

  // if (!response.ok) {
  //   throw new Error('Upload failed');
  // }

  // const data = await response.json();
  // return data.url; 

  if (onProgress) {
    onProgress({ progress: 50 });
    onProgress({ progress: 100 });
  }


  // Generate the local object URL
  const objectUrl = URL.createObjectURL(file);

  console.log(objectUrl)

  return objectUrl;
}