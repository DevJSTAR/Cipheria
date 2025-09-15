import { useState, useCallback } from "react";
import jsQR from "jsqr";

interface QRScanResult {
  data?: string;
  error?: string;
}

function useQRScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<QRScanResult | null>(null);

  const scanQRCode = useCallback((file: File) => {
    setScanning(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        const img = new Image();
        img.src = imageData;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = jsQR(imageDataObj.data, imageDataObj.width, imageDataObj.height);

        URL.revokeObjectURL(imageData);

        if (qrCode) {
          console.log("QR code scanned successfully:", qrCode.data);
          setResult({ data: qrCode.data });
        } else {
          console.log("No QR code found in the image");
          setResult({ error: "No QR code found in the image" });
        }
      } catch (error) {
        console.error("Error scanning QR code:", error);
        setResult({ error: "Failed to scan QR code" });
      } finally {
        setScanning(false);
      }
    };

    reader.readAsDataURL(file);
  }, []);

  return { scanning, result, setResult, scanQRCode };
}

export { useQRScanner };