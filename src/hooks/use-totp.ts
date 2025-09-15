import { useEffect, useState } from "react";
import { authenticator } from '@otplib/preset-default';

authenticator.options = { 
  digits: 6,
  step: 30,
  window: 1
};

interface UseTOTPProps {
  secret: string;
}

function useTOTP({ secret }: UseTOTPProps) {
  const [code, setCode] = useState<string>("");
  const [nextCode, setNextCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!secret) return;

    const generateCodes = () => {
      try {
        if (!secret || typeof secret !== 'string') {
          throw new Error("Invalid secret provided");
        }
        
        const cleanedSecret = secret.replace(/\s/g, "").toUpperCase();
        
        if (!cleanedSecret || cleanedSecret.length === 0) {
          throw new Error("Empty secret provided");
        }

        const currentCode = authenticator.generate(cleanedSecret);
        
        const currentTime = Math.floor(Date.now() / 1000);
        const nextTimePeriod = Math.floor((currentTime + 30) / 30) * 30;
        const nextInstance = authenticator.clone();
        nextInstance.options = { epoch: nextTimePeriod * 1000 };
        const nextCodeValue = nextInstance.generate(cleanedSecret);

        setCode(currentCode);
        setNextCode(nextCodeValue);
      } catch (error) {
        console.error("Error generating TOTP code:", error, "for secret:", secret);
        setCode("ERROR");
        setNextCode("ERROR");
      }
    };

    generateCodes();

    const interval = setInterval(() => {
      try {
        const remaining = authenticator.timeRemaining();
        setTimeLeft(remaining);
        
        if (remaining === 30) {
          generateCodes();
        }
      } catch (error) {
        console.error("Error updating TOTP time:", error);
        setTimeLeft(0);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [secret]);

  return { code, nextCode, timeLeft };
}

export { useTOTP };