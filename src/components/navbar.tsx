"use client";

import { SearchIcon, PlusIcon } from "lucide-react";
import { useId, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import { ImportDialog } from "@/components/import-dialog";
import { QRImportDialog } from "@/components/qr-import-dialog";
import { AddAccountDialog } from "@/components/add-account-dialog";
import Image from "next/image";

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  addOpen: boolean;
  setAddOpen: (open: boolean) => void;
  onAddAccount: (data: { issuer: string; username: string; secret: string; favicon?: string }) => void;
  onImportAccounts: (accounts: { issuer: string; username: string; secret: string; favicon?: string }[]) => void;
}

export default function Navbar({
  searchTerm,
  onSearchChange,
  addOpen,
  setAddOpen,
  onAddAccount,
  onImportAccounts,
}: NavbarProps) {
  const id = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById(id);
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id]);

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo-black.svg" 
              alt="Cipheria Logo" 
              width={32} 
              height={32}
              className="dark:invert"
            />
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Monument Extended, sans-serif' }}>
              Cipheria
            </h1>
          </div>
        </div>

        <div className="grow">
          <div className="relative mx-auto w-full max-w-xs">
            <Input
              id={id}
              className="peer h-8 ps-8 pe-10"
              placeholder="Search TOTP accounts..."
              type="search"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-2">
              <kbd className="text-muted-foreground/70 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ImportDialog onImport={onImportAccounts} />
          <QRImportDialog onImport={onAddAccount} />
          <Button 
            onClick={() => setAddOpen(true)}
            className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            variant="default"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Manually
          </Button>
        </div>
      </div>
      
      <AddAccountDialog 
        open={addOpen} 
        onOpenChange={setAddOpen} 
        onAdd={onAddAccount} 
      />
    </header>
  );
}