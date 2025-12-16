"use client";

import { DataProvider } from "@/context/DataContext";

export function Providers({ children }) {
  return (
    <DataProvider>
      {children}
    </DataProvider>
  );
}
