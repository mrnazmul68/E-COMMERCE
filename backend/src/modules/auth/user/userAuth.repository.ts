import {
  User,
  type UserType,
  type UserDocument,
} from "@modules/auth/models/auth.model.js";
import {
  SessionModel,
  type SessionDocument,
  type SessionType,
} from "@modules/auth/models/session.model.js";

export class UserRepository {
  private readonly model: typeof User;
  private readonly sessionModel: typeof SessionModel;

  constructor(
    model: typeof User = User,
    sessionModel: typeof SessionModel = SessionModel,
  ) {
    this.model = model;
    this.sessionModel = sessionModel;
  }

  //create user
  async createUser(userData: Partial<UserType>): Promise<UserDocument> {
    return await this.model.create(userData);
  }

  //find by email
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.model.findOne({ email }).select("+password").exec();
  }

  //find by id
  async findById(id: string, selectField = ""): Promise<UserDocument | null> {
    return await this.model.findOne({ _id: id }).select(selectField).exec();
  }

}
