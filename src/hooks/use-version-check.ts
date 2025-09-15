"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface VersionInfo {
  version: string;
  notifyUser: boolean;
  features?: string[];
  security?: string[];
}

export function useVersionCheck() {
  const { toast } = useToast();
  
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("Skipping version check in development due to CORS restrictions");
      return;
    }
    
    const checkVersion = async () => {
      try {
        const currentVersion = "0.1.0";
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const targetUrl = "https://junaidweb.vercel.app/projects/cipheria/version.json";
        
        const response = await fetch(proxyUrl + targetUrl, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            "Origin": window.location.origin,
            "Accept": "application/json",
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const versionInfo: VersionInfo = await response.json();
        
        if (versionInfo.notifyUser && isVersionHigher(versionInfo.version, currentVersion)) {
          let description = "This update may include security improvements and new features.";
          
          if (versionInfo.features?.length || versionInfo.security?.length) {
            description = "This update includes:";
            if (versionInfo.security?.length) {
              description += " 🔒 Security improvements";
            }
            if (versionInfo.features?.length) {
              description += " ✨ New features";
            }
            description += " Consider updating to the latest version.";
          }
          
          toast.info(`Version ${versionInfo.version} is available!`, {
            description: description,
            duration: 10000,
          });
        }
      } catch (error) {
        console.debug("Could not check for updates:", error);
      }
    };
    
    checkVersion();
    
    const interval = setInterval(checkVersion, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [toast]);
}

function isVersionHigher(newVersion: string, currentVersion: string): boolean {
  const newParts = newVersion.split(".").map(Number);
  const currentParts = currentVersion.split(".").map(Number);
  
  for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
    const newPart = newParts[i] || 0;
    const currentPart = currentParts[i] || 0;
    
    if (newPart > currentPart) return true;
    if (newPart < currentPart) return false;
  }
  
  return false;
}