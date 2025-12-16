"use client";

import { useState, useCallback } from "react";
import { readDirectory, detectPlatform, getFolderStats } from "@/lib/file-reader";

/**
 * Hook for handling folder upload with platform detection
 * @param {Object} options - Hook options
 * @param {string} options.expectedPlatform - Expected platform ('instagram' or 'twitter')
 * @param {Function} options.onComplete - Callback when files are ready
 * @param {Function} options.onError - Callback on error
 */
export function useFileUpload({ expectedPlatform, onComplete, onError }) {
  const [files, setFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);

  const reset = useCallback(() => {
    setFiles(null);
    setIsLoading(false);
    setError(null);
    setProgress(0);
    setStats(null);
  }, []);

  const handleFiles = useCallback(async (fileList) => {
    if (!fileList || fileList.length === 0) {
      setError("Klasör seçilmedi veya boş");
      onError?.("Klasör seçilmedi veya boş");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(10);

    try {
      // Convert FileList to map
      const fileMap = readDirectory(fileList);
      setProgress(30);

      // Detect platform
      const detectedPlatform = detectPlatform(fileMap);
      setProgress(50);

      if (!detectedPlatform) {
        const err = "Bu klasör Instagram veya Twitter verisi içermiyor";
        setError(err);
        onError?.(err);
        setIsLoading(false);
        return;
      }

      if (detectedPlatform !== expectedPlatform) {
        const err = `Yanlış platform. Beklenen: ${expectedPlatform}, Bulunan: ${detectedPlatform}`;
        setError(err);
        onError?.(err);
        setIsLoading(false);
        return;
      }

      // Get folder stats
      const folderStats = getFolderStats(fileMap);
      setStats(folderStats);
      setProgress(70);

      // Store files
      setFiles(fileMap);
      setProgress(100);

      // Call completion callback
      onComplete?.(fileMap, folderStats);
    } catch (err) {
      const errorMessage = err.message || "Dosyalar işlenirken hata oluştu";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [expectedPlatform, onComplete, onError]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    // Handle dropped items
    const items = e.dataTransfer?.items;
    if (items) {
      // Try to get files from items
      const files = [];
      for (const item of items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
      if (files.length > 0) {
        handleFiles(files);
      }
    }
  }, [handleFiles]);

  const handleInputChange = useCallback((e) => {
    const fileList = e.target.files;
    if (fileList) {
      handleFiles(fileList);
    }
  }, [handleFiles]);

  return {
    files,
    isLoading,
    error,
    progress,
    stats,
    reset,
    handleFiles,
    handleDrop,
    handleInputChange
  };
}
