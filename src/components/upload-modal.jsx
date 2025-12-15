"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Instagram, Upload, FolderOpen, CheckCircle2, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState("idle");
  const [progress, setProgress] = useState(0);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const simulateUpload = useCallback(() => {
    setUploadState("uploading");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState("success");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  }, [simulateUpload]);

  const handleFileSelect = useCallback(() => {
    simulateUpload();
  }, [simulateUpload]);

  const resetState = useCallback(() => {
    setUploadState("idle");
    setProgress(0);
  }, []);

  const config = platform ? platformConfig[platform] : null;

  if (!config) {
    return null;
  }

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
              onClick={handleFileSelect}
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
                {isDragging ? "Bırak!" : "Klasörü sürükle veya tıkla"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                İndirdiğin ZIP&apos;i çıkardıktan sonra klasörü seç
              </p>
            </div>
          </>
        )}

        {uploadState === "uploading" && (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${config.gradient}`}>
                <Upload className="h-8 w-8 text-white animate-pulse" />
              </div>
              <p className="text-sm font-medium mb-4">Veriler işleniyor...</p>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-300 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  %{progress}
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadState === "success" && (
          <div className="py-8">
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-sm font-medium">Veriler başarıyla yüklendi!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Analiz sayfasına yönlendiriliyorsun...
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
