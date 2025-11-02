import { IUser } from "../../types/user.types";

export interface IUserService {
  register(name: string, email: string, res: any): Promise<IUser>;
  login(email: string): Promise<any>
  verifyOtp(email: string, otp: number, res: any): Promise<any>;
  resendOtp(email: string): Promise<any>;
  logout(email: string): Promise<void>
  updateUser(email: string, name?: string, userName?: string, profileImage?: string): Promise<IUser>
  searchUsers(query: string): Promise<any[]>
  saveFcmToken(email: string, fcmToken: string): Promise<void>
  sendNotification(receiverId: string, title: string, body: string): Promise<void>
}
