export interface TOTPAccount {
  id: string;
  issuer: string;
  username: string;
  secret: string;
  favicon?: string;
}