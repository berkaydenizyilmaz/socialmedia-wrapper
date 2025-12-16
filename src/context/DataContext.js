"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { parseInstagramData, getInstagramSummary } from "@/lib/parsers/instagram";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [instagramData, setInstagramData] = useState(null);
  const [instagramSummary, setInstagramSummary] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [error, setError] = useState(null);

  const processInstagramFiles = useCallback(async (files) => {
    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);

    try {
      const data = await parseInstagramData(files, (progress) => {
        setProcessingProgress(progress);
      });
      
      setInstagramData(data);
      setInstagramSummary(getInstagramSummary(data));
      
      return data;
    } catch (err) {
      setError(err.message || "Veriler işlenirken hata oluştu");
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearInstagramData = useCallback(() => {
    setInstagramData(null);
    setInstagramSummary(null);
    setError(null);
    setProcessingProgress(0);
  }, []);

  const value = {
    // Instagram data
    instagramData,
    instagramSummary,
    processInstagramFiles,
    clearInstagramData,
    
    // Processing state
    isProcessing,
    processingProgress,
    error,
    
    // Utility
    hasData: !!instagramData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
