export type CasheUserType = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
};

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}