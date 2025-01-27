"use client";

import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = {
  children: ReactNode;
};

export default function PrivateLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <Navbar />

      <main className="flex-1 bg-background">
        {children}
        <Toaster/>
      </main>
    </div>
  );
}
