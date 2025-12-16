"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { parseInstagramData, getInstagramSummary } from "@/lib/parsers/instagram";
import { parseTwitterData, getTwitterSummary } from "@/lib/parsers/twitter";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Instagram state
  const [instagramData, setInstagramData] = useState(null);
  const [instagramSummary, setInstagramSummary] = useState(null);
  
  // Twitter state
  const [twitterData, setTwitterData] = useState(null);
  const [twitterSummary, setTwitterSummary] = useState(null);
  
  // Shared processing state
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

  const processTwitterFiles = useCallback(async (files) => {
    setIsProcessing(true);
    setError(null);
    setProcessingProgress(0);

    try {
      const data = await parseTwitterData(files, (progress) => {
        setProcessingProgress(progress);
      });
      
      setTwitterData(data);
      setTwitterSummary(getTwitterSummary(data));
      
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

  const clearTwitterData = useCallback(() => {
    setTwitterData(null);
    setTwitterSummary(null);
    setError(null);
    setProcessingProgress(0);
  }, []);

  const value = {
    // Instagram data
    instagramData,
    instagramSummary,
    processInstagramFiles,
    clearInstagramData,
    
    // Twitter data
    twitterData,
    twitterSummary,
    processTwitterFiles,
    clearTwitterData,
    
    // Processing state
    isProcessing,
    processingProgress,
    error,
    
    // Utility
    hasData: !!instagramData || !!twitterData,
    hasInstagramData: !!instagramData,
    hasTwitterData: !!twitterData
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
