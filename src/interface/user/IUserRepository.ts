import { IUser } from "../../types/user.types";

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  saveOtp(email: string, otp: number): Promise<void>;
  update(id: string, user: Partial<IUser>): Promise<void>;
  markVerified(email: string): Promise<IUser | null>;
  markUnverified(email: string): Promise<void>;
  updateUser(email: string, updateData: any): Promise<IUser | null>;
  searchUsers(query: string): Promise<IUser[]>
}
