import { UserStatus } from "../enums/UserStatus";

export interface User {
  _id: string;
  username: string;
  walletAddress: string;
  balance: number;
  profit: number;
  isAdmin: boolean;
  wins: number;
  losses: number;
  score: number;
  scoreAsArrey: number[];
  status: UserStatus;
  refferalCode: string;
  refferedBy?: string;
  refferedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
}
