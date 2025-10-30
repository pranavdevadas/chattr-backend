import { injectable } from "inversify";
import User from "../model/userModel";
import { IUser } from "../types/user.types";
import { BaseRepository } from "./base/baseRepository";
import { IUserRepository } from "../interface/user/IUserRepository";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  private readonly UserModel = User;

  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.UserModel.findOne({ email });
  }

  async saveOtp(email: string, otp: number): Promise<void> {
    await this.update({ email }, { otp });
  }

  async markVerified(email: string): Promise<IUser | null> {
    return await this.model.findOneAndUpdate(
      { email },
      { isVerified: true, otp: undefined, updatedAt: new Date() },
      { new: true }
    );
  }

  async markUnverified(email: string): Promise<void> {
    await this.model.findOneAndUpdate(
      { email },
      { isVerified: false, otp: undefined, updatedAt: new Date() }
    );
  }

  async updateUser(email: string, updateData: any): Promise<IUser | null> {
    return await this.model.findOneAndUpdate(
      { email },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
  }

  async searchUsers(query: string): Promise<IUser[]> {
    return await this.UserModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id name userName email profileImage")
      .limit(10);
  }
}
