import { createHash, timingSafeEqual } from "node:crypto";
import { Types } from "mongoose";
import {
  SessionModel,
  type SessionDocument,
  type SessionType,
} from "@modules/auth/models/session.model.js";

//Hash token
export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

//Has equal
export const hashesEqual = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
};

export type CreateSessionInput = Partial<SessionType> & {
  _id?: Types.ObjectId;
};

interface RotateSessionInput {
  sessionId: string;
  oldHash: string;
  oldJti: string;
  newHash: string;
  newJti: string;
  now: Date;
}

export class SessionRepository {
  private readonly model: typeof SessionModel;

  constructor(model: typeof SessionModel = SessionModel) {
    this.model = model;
  }

  //Create session
  async createSession(
    sessionData: CreateSessionInput,
  ): Promise<SessionDocument> {
    return await this.model.create(sessionData);
  }

  //Find session by ID
  async findById(sessionId: string): Promise<SessionDocument | null> {
    return await this.model
      .findById(sessionId)
      .select("+currentTokenHash +previousTokenHash")
      .exec();
  }

  //Rotate session
  async rotate({
    sessionId,
    oldHash,
    oldJti,
    newHash,
    newJti,
    now,
  }: RotateSessionInput): Promise<SessionDocument | null> {
    return await this.model
      .findOneAndUpdate(
        {
          _id: sessionId,
          currentTokenHash: oldHash,
          revokedAt: null,
          expiresAt: { $gt: now },
        },
        {
          $set: {
            previousTokenHash: oldHash,
            previousJti: oldJti,
            currentTokenHash: newHash,
            currentJti: newJti,
            rotatedAt: now,
          },
        },
        { returnDocument: "after" },
      )
      .exec();
  }

  //Revoke session
  async revokeSession(
    sessionId: string,
    now: Date = new Date(),
  ): Promise<void> {
    await this.model
      .updateOne(
        { _id: sessionId, revokedAt: null },
        { $set: { revokedAt: now } },
      )
      .exec();
  }

  //Revoke all
  async revokeAllForUser(
    userId: string,
    now: Date = new Date(),
  ): Promise<void> {
    await this.model
      .updateMany(
        { user: userId, revokedAt: null },
        { $set: { revokedAt: now } },
      )
      .exec();
  }
}
