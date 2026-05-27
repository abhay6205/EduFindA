"use client";

import { Header } from "@/components/navbar/Header";

export default function AdsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Advertisements</h1>
          <p className="text-lg text-muted-foreground">This feature is coming soon! Stay tuned.</p>
        </div>
      </div>
    </div>
  );
}
