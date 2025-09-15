"use client";

import { useEffect, useState } from "react";

interface UseMasterPasswordProps {
  onAuthenticated: (encryptionKey: string) => void;
}

function useMasterPassword({ onAuthenticated }: UseMasterPasswordProps) {
  const [hasMasterPassword, setHasMasterPassword] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMasterPassword = async () => {
      try {
        const stored = localStorage.getItem("masterPassword");
        if (stored) {
          setHasMasterPassword(true);
        } else {
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error("Failed to check master password:", error);
      } finally {
        setLoading(false);
      }
    };

    checkMasterPassword();
  }, []);

  const setMasterPassword = async (password: string) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      localStorage.setItem("masterPassword", hashHex);
      setHasMasterPassword(true);
      setIsFirstTime(false);
      onAuthenticated(password);
    } catch (error) {
      console.error("Failed to set master password:", error);
    }
  };

  const verifyMasterPassword = async (password: string) => {
    try {
      const storedHash = localStorage.getItem("masterPassword");
      if (!storedHash) return false;

      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      if (hashHex === storedHash) {
        onAuthenticated(password);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to verify master password:", error);
      return false;
    }
  };

  const removeMasterPassword = () => {
    localStorage.removeItem("masterPassword");
    localStorage.removeItem("accounts");
    setHasMasterPassword(false);
    setIsFirstTime(true);
  };

  return {
    hasMasterPassword,
    isFirstTime,
    loading,
    setMasterPassword,
    verifyMasterPassword,
    removeMasterPassword
  };
}

export { useMasterPassword };