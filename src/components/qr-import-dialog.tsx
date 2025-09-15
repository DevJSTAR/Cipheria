"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { UploadIcon } from "lucide-react";
import { useQRScanner } from "@/hooks/use-qr-scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import * as OTPAuth from "otpauth";

interface QRImportDialogProps {
  onImport: (account: { issuer: string; username: string; secret: string; favicon?: string }) => void;
}

function QRImportDialog({ onImport }: QRImportDialogProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { scanQRCode, scanning, result, setResult } = useQRScanner();
  const { toast } = useToast();
  
  const handleImport = useCallback(onImport, [onImport]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      scanQRCode(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    if (result) {
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (!result.data) {
        toast.error("No data found in QR code");
        return;
      }

      const processQrData = async () => {
        try {
          const parsedData = parseOtpAuthUri(result.data!);
          
          handleImport({ 
            issuer: parsedData.issuer, 
            username: parsedData.username, 
            secret: parsedData.secret,
          });
          
          toast.success("The account has been successfully imported.");
          
          setOpen(false);
          setResult(null);
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred while parsing the QR code.");
          }
        }
      };

      processQrData();
    }
  }, [result, handleImport, setResult, toast]);

  const parseOtpAuthUri = (uri: string) => {
    
    let formattedUri = uri.trim();
    
    if (formattedUri.startsWith("otpauth-migration://")) {
      throw new Error("Google Authenticator migration URIs are not supported.");
    }
    
    if (!formattedUri.startsWith("otpauth://")) {
      if (formattedUri.startsWith("otpauth:")) {
        formattedUri = "otpauth://" + formattedUri.substring(8);
      } else {
        formattedUri = "otpauth://totp/unknown:" + formattedUri;
      }
    }
    
    try {
      const url = new URL(formattedUri);
      const secret = url.searchParams.get("secret");
      
      if (secret) {
        const issuer = url.searchParams.get("issuer") || "";
        
        let username = "";
        const path = url.pathname;
        if (path.includes(":")) {
          const parts = path.split(":");
          if (parts.length > 1) {
            username = decodeURIComponent(parts[1].split("?")[0]);
          }
        } else if (path.includes("/")) {
          const parts = path.split("/");
          if (parts.length > 2) {
            username = decodeURIComponent(parts[2].split("?")[0]);
          }
        }
        
        if (secret) {
          return { issuer, username, secret };
        }
      }
    } catch (urlError) {
      console.error("URL parsing error:", urlError);
    }
    
    try {
      const secretMatch = formattedUri.match(/[?&]secret=([^&]+)/);
      if (secretMatch && secretMatch[1]) {
        const secret = secretMatch[1];
        const issuerMatch = formattedUri.match(/[?&]issuer=([^&]+)/);
        const issuer = issuerMatch ? decodeURIComponent(issuerMatch[1]) : "";
        
        let username = "";
        const pathMatch = formattedUri.match(/totp\/([^:]+):([^?]+)/) || 
                        formattedUri.match(/\/([^:]+):([^?]+)/);
        if (pathMatch) {
          username = decodeURIComponent(pathMatch[2]);
        }
        
        if (secret) {
          return { issuer, username, secret };
        }
      }
    } catch (manualError) {
      console.error("Manual parsing error:", manualError);
    }
    
    try {
      const parsed = OTPAuth.URI.parse(formattedUri);
      
      if (parsed instanceof OTPAuth.TOTP) {
        const totp = parsed;
        
        const issuer = totp.issuer || "";
        const username = totp.label || "";
        const secret = totp.secret.base32;
        
        if (!secret) {
          throw new Error("No secret found in QR code");
        }
        
        if (!username && formattedUri.includes(":")) {
          const parts = formattedUri.split(":");
          if (parts.length >= 4) {
            const labelPart = parts[3].split("?")[0];
            if (labelPart.includes("/")) {
              const labelParts = labelPart.split("/");
              if (labelParts.length > 1) {
                if (!issuer) {
                  const labelIssuer = labelParts[0];
                  if (labelIssuer && labelIssuer !== "unknown") {
                    return { issuer: labelIssuer, username: labelParts[1], secret };
                  }
                }
                return { issuer, username: labelParts[1], secret };
              }
            }
          }
        }
        
        return { issuer, username, secret };
      } else {
        throw new Error("Only TOTP is supported");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Invalid QR code: ${error.message}`);
      } else {
        throw new Error("Invalid QR code: Unknown error occurred");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      } else {
        setOpen(isOpen);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadIcon className="mr-2 h-4 w-4" />
          Import QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import QR Code</DialogTitle>
          <DialogDescription>
            Upload a QR code image to import a TOTP account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="qr-code" className="text-right">
              QR Code
            </Label>
            <div className="col-span-3">
              <Input
                id="qr-code"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
              >
                <UploadIcon className="mr-2 h-4 w-4" />
                {scanning ? "Scanning..." : "Choose File"}
              </Button>
              {result?.data && (
                <p className="mt-2 text-sm text-green-600">
                  QR code scanned successfully!
                </p>
              )}
              {result?.error && (
                <p className="mt-2 text-sm text-red-600">{result.error}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { QRImportDialog };