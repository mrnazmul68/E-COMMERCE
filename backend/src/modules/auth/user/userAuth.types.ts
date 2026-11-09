export type CasheUserType = {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
};