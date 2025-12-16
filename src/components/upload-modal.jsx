"use client";

import { useRef, useCallback, useState } from "react";
import Image from "next/image";
import { Instagram, Upload, FolderOpen, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useData } from "@/context/DataContext";

const platformConfig = {
  instagram: {
    icon: <Instagram className="h-5 w-5 text-white" />,
    title: "Instagram",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    downloadUrl: "https://accountscenter.instagram.com/info_and_permissions/dyi/",
    steps: [
      "Instagram Hesap Merkezi'ne git",
      "\"Bilgilerini indir\" seçeneğine tıkla",
      "Format olarak JSON seç",
      "İndirilen ZIP dosyasını çıkar",
      "Klasörü buraya yükle",
    ],
  },
  twitter: {
    icon: <Image src="/twitter.png" alt="Twitter" width={20} height={20} className="h-5 w-5" />,
    title: "Twitter / X",
    gradient: "from-neutral-200 to-neutral-400",
    downloadUrl: "https://x.com/settings/download_your_data",
    steps: [
      "X/Twitter Ayarlar sayfasına git",
      "\"Arşivini indir\" seçeneğine tıkla",
      "Doğrulama işlemini tamamla",
      "İndirilen ZIP dosyasını çıkar",
      "Klasörü buraya yükle",
    ],
  },
};

export function UploadModal({ platform, open, onOpenChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState("idle"); // idle, uploading, processing, success, error
  const [uploadError, setUploadError] = useState(null);
  
  const { processInstagramFiles, processingProgress, isProcessing } = useData();

  const { 
    isLoading: isUploading, 
    error: fileError, 
    progress: uploadProgress,
    stats,
    handleInputChange,
    reset: resetFileUpload
  } = useFileUpload({
    expectedPlatform: platform,
    onComplete: async (files) => {
      setUploadState("processing");
      try {
        if (platform === "instagram") {
          await processInstagramFiles(files);
        }
        // Twitter processing will be added later
        setUploadState("success");
      } catch (err) {
        setUploadError(err.message || "Veriler işlenirken hata oluştu");
        setUploadState("error");
      }
    },
    onError: (error) => {
      setUploadError(error);
      setUploadState("error");
    }
  });

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    // Unfortunately, webkitdirectory doesn't work with drag & drop
    // So we just show a message to use the file picker
    setUploadError("Klasör sürüklemek şu an desteklenmiyor. Lütfen tıklayarak klasör seçin.");
    setUploadState("error");
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    setUploadState("uploading");
    setUploadError(null);
    handleInputChange(e);
  }, [handleInputChange]);

  const resetState = useCallback(() => {
    setUploadState("idle");
    setUploadError(null);
    resetFileUpload();
  }, [resetFileUpload]);

  const config = platform ? platformConfig[platform] : null;

  if (!config) {
    return null;
  }

  // Calculate combined progress
  const currentProgress = uploadState === "uploading" 
    ? uploadProgress 
    : uploadState === "processing" 
      ? processingProgress 
      : 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetState();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br ${config.gradient}`}>
              {config.icon}
            </div>
            <div>
              <DialogTitle>{config.title} Verilerini Yükle</DialogTitle>
              <DialogDescription>
                Verilerini analiz etmek için klasörünü yükle
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Hidden file input with webkitdirectory */}
        <input
          ref={fileInputRef}
          type="file"
          webkitdirectory="true"
          directory=""
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {uploadState === "idle" && (
          <>
            {/* Steps */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Nasıl indirilir?</p>
              <ol className="space-y-2">
                {config.steps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <a href={config.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  İndirme sayfasına git
                </a>
              </Button>
            </div>

            {/* Upload area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={cn(
                "relative mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                isDragging ? "bg-primary/10" : "bg-muted"
              )}>
                <FolderOpen className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )} />
              </div>
              <p className="text-sm font-medium">
                {isDragging ? "Bırak!" : "Klasörü seçmek için tıkla"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                İndirdiğin ZIP&apos;i çıkardıktan sonra klasörü seç
              </p>
            </div>
          </>
        )}

        {(uploadState === "uploading" || uploadState === "processing") && (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${config.gradient}`}>
                <Upload className="h-8 w-8 text-white animate-pulse" />
              </div>
              <p className="text-sm font-medium mb-4">
                {uploadState === "uploading" ? "Dosyalar okunuyor..." : "Veriler analiz ediliyor..."}
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-300 ease-out`}
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  %{currentProgress}
                </p>
              </div>

              {stats && (
                <p className="mt-4 text-xs text-muted-foreground">
                  {stats.totalFiles} dosya • {stats.totalSizeMB} MB
                </p>
              )}
            </div>
          </div>
        )}

        {uploadState === "success" && (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm font-medium">Veriler başarıyla işlendi!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Analiz sayfasına yönlendiriliyorsun...
              </p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  onOpenChange(false);
                  // TODO: Navigate to analysis page
                }}
              >
                Analizi Görüntüle
              </Button>
            </div>
          </div>
        )}

        {uploadState === "error" && (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-sm font-medium">Bir hata oluştu</p>
              <p className="mt-1 text-xs text-muted-foreground text-center max-w-xs">
                {uploadError || fileError || "Bilinmeyen bir hata oluştu"}
              </p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={resetState}
              >
                Tekrar Dene
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
