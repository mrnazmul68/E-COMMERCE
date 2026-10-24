import {
	User,
	type UserDocument,
	type UserType,
} from "@modules/auth/models/auth.model.js";
import {
	SessionModel,
	type SessionDocument,
	type SessionType,
} from "@modules/auth/models/session.model.js";

export class AdminRepository {
	constructor(
		private readonly userModel = User,
		private readonly sessionModel = SessionModel,
	) {}

	async findByEmail(email: string): Promise<UserDocument | null> {
		return this.userModel.findOne({ email }).select("+password").exec();
	}

	async createAdmin(userData: Partial<UserType>): Promise<UserDocument> {
		return this.userModel.create({ ...userData, role: "admin" });
	}

	async createSession(
		sessionData: Partial<SessionType>,
	): Promise<SessionDocument> {
		return this.sessionModel.create(sessionData);
	}

	async revokeSession(sessionId: string, userId: string): Promise<void> {
		await this.sessionModel
			.updateOne(
				{ _id: sessionId, user: userId, revoked: false },
				{ $set: { revoked: true } },
			)
			.exec();
	}
}
