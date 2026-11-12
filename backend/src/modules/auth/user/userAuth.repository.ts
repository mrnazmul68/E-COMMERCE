import {
  User,
  type UserType,
  type UserDocument,
} from "@modules/auth/models/auth.model.js";

export class UserRepository {
  private readonly model: typeof User;

  constructor(model: typeof User = User) {
    this.model = model;
  }

  //create user
  async createUser(userData: Partial<UserType>): Promise<UserDocument> {
    return await this.model.create(userData);
  }

  //find by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.model.findOne({ email }).select("+password").exec();
  }

  //find by Google's stable account identifier (`sub`)
  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return await this.model.findOne({ googleId }).exec();
  }

  //link Google to an existing password account
  async linkGoogleId(
    id: string,
    googleId: string,
  ): Promise<UserDocument | null> {
    return await this.model
      .findOneAndUpdate(
        { _id: id, googleId: { $exists: false } },
        { $set: { googleId } },
        { new: true, runValidators: true },
      )
      .exec();
  }

  //find by id
  async findById(id: string, selectField = ""): Promise<UserDocument | null> {
    return await this.model.findOne({ _id: id }).select(selectField).exec();
  }

  //invalidate every access token issued before this call
  async incrementTokenVersion(id: string): Promise<void> {
    await this.model
      .updateOne({ _id: id }, { $inc: { tokenVersion: 1 } })
      .exec();
  }
}
