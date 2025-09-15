"use client";

import { useEffect, useState } from "react";
import { TOTPAccount } from "@/lib/data";
import { secureStorage } from "@/lib/secure-storage";

interface UseAccountsProps {
  encryptionKey: string;
}

function useAccounts({ encryptionKey }: UseAccountsProps) {
  const [accounts, setAccounts] = useState<TOTPAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const stored = localStorage.getItem("accounts");
        if (stored) {
          try {
            const decrypted = await secureStorage.decrypt(JSON.parse(stored), encryptionKey);
            setAccounts(JSON.parse(decrypted));
          } catch (error) {
            console.error("Failed to decrypt accounts:", error);
            setAccounts([]);
          }
        }
      } catch (error) {
        console.error("Failed to load accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (encryptionKey) {
      loadAccounts();
    }
  }, [encryptionKey]);

  const saveAccounts = async (newAccounts: TOTPAccount[]) => {
    try {
      const encrypted = await secureStorage.encrypt(JSON.stringify(newAccounts), encryptionKey);
      localStorage.setItem("accounts", JSON.stringify(encrypted));
      setAccounts(newAccounts);
    } catch (error) {
      console.error("Failed to save accounts:", error);
    }
  };

  const addAccount = async (account: Omit<TOTPAccount, "id">) => {
    const newAccount = {
      ...account,
      id: Math.random().toString(36).substr(2, 9),
    };
    const newAccounts = [...accounts, newAccount];
    await saveAccounts(newAccounts);
    return newAccount;
  };

  const updateAccount = async (id: string, updates: Partial<TOTPAccount>) => {
    const newAccounts = accounts.map((account) =>
      account.id === id ? { ...account, ...updates } : account
    );
    await saveAccounts(newAccounts);
  };

  const deleteAccount = async (id: string) => {
    const newAccounts = accounts.filter((account) => account.id !== id);
    await saveAccounts(newAccounts);
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    setAccounts,
  };
}

export { useAccounts };