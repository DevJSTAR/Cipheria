"use client";

import { HeartIcon } from "lucide-react";
import Link from "next/link";

export function FloatingCredit() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="text-xs flex items-center gap-1 text-muted-foreground">
        Made with 
        <HeartIcon className="h-3 w-3 text-red-500 fill-current" /> 
        by 
        <Link 
          href="https://junaid.xyz" 
          target="_blank"
          className="underline hover:no-underline transition-all"
          style={{ fontFamily: 'Monument Extended, sans-serif' }}
        >
          Junaid
        </Link>
      </div>
    </div>
  );
}