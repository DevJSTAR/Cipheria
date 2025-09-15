import { Buffer } from "buffer";

interface EncryptedData {
  iv: string;
  salt: string;
  ciphertext: string;
}

class SecureStorage {
  private readonly algorithm = "AES-GCM";
  private readonly keyDerivationAlgorithm = "PBKDF2";
  private readonly hashAlgorithm = "SHA-256";
  private readonly keyLength = 256;
  private readonly iterations = 100000;

  async deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: this.keyDerivationAlgorithm },
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: this.keyDerivationAlgorithm,
        salt,
        iterations: this.iterations,
        hash: this.hashAlgorithm,
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(data: string, password: string): Promise<EncryptedData> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await this.deriveKey(password, salt);

    const encodedData = new TextEncoder().encode(data);
    const ciphertext = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      encodedData
    );

    return {
      iv: Buffer.from(iv).toString("hex"),
      salt: Buffer.from(salt).toString("hex"),
      ciphertext: Buffer.from(ciphertext).toString("hex"),
    };
  }

  async decrypt(encryptedData: EncryptedData, password: string): Promise<string> {
    const salt = Buffer.from(encryptedData.salt, "hex");
    const iv = Buffer.from(encryptedData.iv, "hex");
    const ciphertext = Buffer.from(encryptedData.ciphertext, "hex");
    const key = await this.deriveKey(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  }
}

export const secureStorage = new SecureStorage();