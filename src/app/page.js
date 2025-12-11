"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { PlatformCard } from "@/components/platform-card";
import { Background } from "@/components/background";
import { UploadModal } from "@/components/upload-modal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const openModal = (platform) => {
    setSelectedPlatform(platform);
    setModalOpen(true);
  };

  return (
    <>
      <Background />

      <main className="relative min-h-svh flex flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex-1 flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20">
          <div className="w-full max-w-5xl space-y-10 sm:space-y-14 lg:space-y-16">
            <Header />

            {/* Platform Cards */}
            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto w-full">
              <PlatformCard
                title="Instagram"
                description="Gönderilerini, hikayelerini ve beğenilerini analiz et."
                buttonText="Analizi Başlat"
                variant="instagram"
                onClick={() => openModal("instagram")}
              />
              <PlatformCard
                title="Twitter / X"
                description="Tweetlerini, beğenilerini ve etkileşimlerini keşfet."
                buttonText="Analizi Başlat"
                variant="twitter"
                onClick={() => openModal("twitter")}
              />
            </div>
          </div>
        </div>
      </main>

      <UploadModal
        platform={selectedPlatform}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
