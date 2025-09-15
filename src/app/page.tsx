"use client";

import { useState, useEffect } from "react";
import { TOTPCard } from "@/components/totp-card";
import { LoginForm } from "@/components/login-form";
import { SetupPasswordForm } from "@/components/setup-password-form";
import { useTOTP } from "@/hooks/use-totp";
import { useAccounts } from "@/hooks/use-accounts";
import { useMasterPassword } from "@/hooks/use-master-password";
import { useVersionCheck } from "@/hooks/use-version-check";
import { type TOTPAccount } from "@/lib/data";
import * as z from "zod";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { secureStorage } from "@/lib/secure-storage";
import Navbar from "@/components/navbar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [encryptionKey, setEncryptionKey] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importedAccounts, setImportedAccounts] = useState<TOTPAccount[]>([]);
  const { toast } = useToast();
  
  useVersionCheck();
  
  const { isFirstTime, loading: authLoading, setMasterPassword, verifyMasterPassword } = useMasterPassword({
    onAuthenticated: setEncryptionKey
  });
  
  const { accounts, loading: accountsLoading, addAccount, updateAccount, deleteAccount, setAccounts } = useAccounts({ encryptionKey });

  useEffect(() => {
    if (importedAccounts.length > 0) {
      setAccounts(prevAccounts => [...prevAccounts, ...importedAccounts]);
      setImportedAccounts([]);
    }
  }, [importedAccounts, setAccounts]);

  const filteredAccounts = accounts.filter(
    (account) =>
      account.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditAccount = async (id: string, data: z.infer<typeof formSchema>) => {
    await updateAccount(id, data);
  };

  const handleDeleteAccount = async (id: string) => {
    await deleteAccount(id);
    toast.success("The TOTP account has been successfully deleted.");
  };

  const handleAddAccount = async (data: { issuer: string; username: string; secret: string; favicon?: string }) => {
    await addAccount(data);
    toast.success("The TOTP account has been successfully added.");
  };

  const handleImportAccounts = async (importedAccountsData: { issuer: string; username: string; secret: string; favicon?: string }[]) => {
    setIsImporting(true);
    try {
      const stored = localStorage.getItem("accounts");
      let currentAccounts: TOTPAccount[] = [];
      
      if (stored) {
        try {
          const decrypted = await secureStorage.decrypt(JSON.parse(stored), encryptionKey);
          currentAccounts = JSON.parse(decrypted);
        } catch (error) {
          console.error("Failed to decrypt accounts:", error);
          currentAccounts = [];
        }
      }
      
      const newAccounts = importedAccountsData.map(account => ({
        ...account,
        id: Math.random().toString(36).substr(2, 9),
      }));
      
      const allAccounts = [...currentAccounts, ...newAccounts];
      
      const encrypted = await secureStorage.encrypt(JSON.stringify(allAccounts), encryptionKey);
      localStorage.setItem("accounts", JSON.stringify(encrypted));
      
      setImportedAccounts(newAccounts);
      
      toast.success(`Imported ${importedAccountsData.length} TOTP accounts successfully`);
    } catch (error) {
      toast.error("Failed to import accounts");
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleSetupPassword = async (password: string) => {
    await setMasterPassword(password);
  };

  const handleLogin = async (password: string) => {
    const isValid = await verifyMasterPassword(password);
    if (!isValid) {
      toast.error("Invalid password. Please check your password and try again.");
      setEncryptionKey(""); 
      setTimeout(() => setEncryptionKey(""), 0); 
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isFirstTime) {
    return <SetupPasswordForm onSetup={handleSetupPassword} />;
  }

  if (!encryptionKey) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (accountsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading your TOTP accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        onAddAccount={handleAddAccount}
        onImportAccounts={handleImportAccounts}
      />
      <main className="container py-6 mx-auto">
        {accounts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4"
          >
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Monument Extended, sans-serif' }}>Cipheria</h2>
            <p className="text-muted-foreground">Add your first TOTP account to get started</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="flex justify-center">
                  <TOTPCardWrapper 
                    account={account} 
                    onEdit={(data) => handleEditAccount(account.id, data)}
                    onDelete={() => handleDeleteAccount(account.id)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
      
      {isImporting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <h3 className="text-2xl font-medium text-white mb-2">Importing Accounts</h3>
          <p className="text-white text-opacity-80">
            {accounts.length > 10 
              ? "This may take a moment..." 
              : "Adding your TOTP accounts..."}
          </p>
        </div>
      )}
    </motion.div>
  );
}

const formSchema = z.object({
  issuer: z.string().min(1, "Issuer is required"),
  username: z.string().min(1, "Username is required"),
  favicon: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

function TOTPCardWrapper({ 
  account, 
  onEdit,
  onDelete
}: { 
  account: TOTPAccount;
  onEdit: (data: z.infer<typeof formSchema>) => void;
  onDelete: () => void;
}) {
  const { code, nextCode, timeLeft } = useTOTP({ secret: account.secret });

  return (
    <TOTPCard
      id={account.id}
      issuer={account.issuer}
      username={account.username}
      code={code}
      nextCode={nextCode}
      timeLeft={timeLeft}
      favicon={account.favicon}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}