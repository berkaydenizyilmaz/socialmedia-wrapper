"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Upload, Loader2, Shield } from "lucide-react";

export function ProviderModal({
  provider,
  fileName,
  onFileSelect,
  onClose,
  onProcess,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  if (!provider) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onProcess();
    }, 2000);
  };

  return (
    <Dialog open={!!provider} onOpenChange={onClose}>
      <DialogContent onClose={onClose} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl">{provider.icon}</div>
            <div>
              <DialogTitle>{provider.name} Analizi</DialogTitle>
              <DialogDescription className="mt-1">
                Verilerini yükle, analizini gör
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Steps */}
        <div className="mb-6 space-y-3">
          <h4 className="text-sm font-semibold text-white mb-3">Adımlar:</h4>
          {provider.steps.map((step, idx) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4"
            >
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                {idx + 1}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">{step}</p>
            </div>
          ))}
        </div>

        {/* File Upload Area */}
        <div className="mb-6 space-y-3">
          <label className="block text-sm font-semibold text-white">
            Dosyanı Seç
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : fileName
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={provider.accepted}
              onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3 text-center">
              {fileName ? (
                <>
                  <div className="text-4xl">✅</div>
                  <div>
                    <p className="font-semibold text-emerald-400 mb-1">Hazır!</p>
                    <p className="text-sm text-zinc-400 break-all">{fileName}</p>
                  </div>
                  <button
                    className="text-xs text-zinc-500 hover:text-zinc-300 underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileSelect(null);
                    }}
                  >
                    Farklı dosya seç
                  </button>
                </>
              ) : (
                <>
                  <div className="text-4xl">📁</div>
                  <div>
                    <p className="font-medium text-white mb-1">
                      {isDragging ? 'Bırak buraya' : 'Dosyayı sürükle ya da tıkla'}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {provider.accepted} dosyaları kabul edilir
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <Badge variant="success" className="flex items-start gap-2">
            <Shield className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
            <span>Dosyan sadece senin bilgisayarında işlenir, hiçbir yere gönderilmez.</span>
          </Badge>
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">Hemen başla</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button 
                disabled={!fileName || isProcessing}
                onClick={handleProcess}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  'Analiz Et'
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
