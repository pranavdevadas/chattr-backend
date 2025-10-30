import { Model, Document } from "mongoose";
import { IUser } from "../../types/user.types";

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(user: Partial<T>): Promise<T> {
    const created = new this.model(user);
    return await created.save();
  }

  async findOne(query: any): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async update(query: any, update: Partial<T>): Promise<void> {
    await this.model.updateOne(query, update).exec();
  }
}
