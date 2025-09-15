"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadIcon, ArrowLeftIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ImportDialogProps {
  onImport: (accounts: { issuer: string; username: string; secret: string; favicon?: string }[]) => void;
}

function ImportDialog({ onImport }: ImportDialogProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"authenticators" | "proton" | "instructions">("authenticators");
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    const reader = new FileReader();
            reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);
        
        if (data.version !== 1 || !Array.isArray(data.entries)) {
          throw new Error("Invalid file format");
        }

        const accounts = [];
        for (const entry of data.entries) {
          const url = new URL(entry.content.uri);
          const issuer = url.searchParams.get("issuer") || "";
          const secret = url.searchParams.get("secret") || "";

          accounts.push({
            issuer,
            username: entry.content.name,
            secret,
          });
        }

        onImport(accounts);
        setOpen(false);
        setView("authenticators");
        setFile(null);
      } catch (error) {
        toast.error("Failed to parse the import file");
        console.error("Import error:", error);
      }
    };

    reader.readAsText(file);
  };

  const resetDialog = () => {
    setView("authenticators");
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetDialog();
      }
      setOpen(isOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">Import from File</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <AnimatePresence mode="wait">
          {view === "authenticators" ? (
            <motion.div
              key="authenticators"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>Import from</DialogTitle>
                <DialogDescription>
                  Select an authenticator app to import from
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <Card 
                  className="cursor-not-allowed"
                  style={{ opacity: 0.5, filter: "grayscale(100%)" }}
                >
                  <CardHeader className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center" style={{ marginLeft: '-5px' }}>
                      <Image 
                        src="/assets/google-authenticator.svg" 
                        alt="Google Authenticator" 
                        width={64}
                        height={64}
                        className="w-16 h-16"
                      />
                    </div>
                    <CardTitle className="text-center">Google Authenticator</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card 
                  className="cursor-pointer transition-all duration-200 border-2 hover:shadow-lg"
                  onClick={() => setView("instructions")}
                >
                  <CardHeader className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center" style={{ marginLeft: '-5px' }}>
                      <Image 
                        src="/assets/proton-authenticator.svg" 
                        alt="Proton Authenticator" 
                        width={64}
                        height={64}
                        className="w-16 h-16"
                      />
                    </div>
                    <CardTitle className="text-center">Proton Authenticator</CardTitle>
                  </CardHeader>
                </Card>
                
                <Card 
                  className="cursor-not-allowed"
                  style={{ opacity: 0.5, filter: "grayscale(100%)" }}
                >
                  <CardHeader className="flex flex-col items-center justify-center">
                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center" style={{ marginLeft: '-5px' }}>
                      <Image 
                        src="/assets/bitwarden.svg" 
                        alt="Bitwarden" 
                        width={64}
                        height={64}
                        className="w-16 h-16"
                      />
                    </div>
                    <CardTitle className="text-center">Bitwarden</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </motion.div>
          ) : view === "instructions" ? (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setView("authenticators")}
                    className="h-8 w-8"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <DialogTitle>Import from Proton Authenticator</DialogTitle>
                </div>
                <DialogDescription>
                  Follow these instructions to export your accounts
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Open Proton Authenticator app</li>
                  <li>Tap the settings icon in the top right</li>
                  <li>Select &quot;Export&quot; under &quot;Manage your data&quot; section</li>
                  <li>Choose &quot;Export data without password&quot;</li>
                  <li>Save the file to your device</li>
                </ol>
                <div className="mt-6">
                  <Button onClick={() => setView("proton")}>
                    I have my export file
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="proton"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setView("authenticators")}
                    className="h-8 w-8"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <DialogTitle>Import from Proton Authenticator</DialogTitle>
                </div>
                <DialogDescription>
                  Upload your Proton Authenticator export file
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div 
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => document.getElementById("import-file")?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Input
                    id="import-file"
                    type="file"
                    accept=".txt,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop your export file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: .txt, .json (without password protection)
                  </p>
                  {file && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected file: {file.name}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleImport} disabled={!file}>
                  Import
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export { ImportDialog };