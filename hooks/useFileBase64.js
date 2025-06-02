'use client';
import { useState } from 'react';
import fileToBase64 from '@/lib/file-to-base64';

export function useFileBase64() {
  const [imageBase64, setImageBase64] = useState('');

  const handleFileBase64 = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64String = await fileToBase64(file);
      setImageBase64(base64String);
    } catch (error) {
      console.error('Error converting file to base64', error);
    }
  };

  return { imageBase64, setImageBase64, handleFileBase64 };
}