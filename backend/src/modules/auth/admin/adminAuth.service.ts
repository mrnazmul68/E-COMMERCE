import bcrypt from "bcrypt";
import { env } from "@config/env.js";
import { AdminRepository } from "@modules/auth/admin/adminAuth.repository.js";
import type { SessionType } from "@modules/auth/models/session.model.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import { generateAccessToken, generateRefreshToken } from "@utils/jwt.js";

export class AdminService {
  constructor(private readonly adminRepository = new AdminRepository()) {}

  async login(
    credentials: { email: string; password: string },
    sessionData: Pick<SessionType, "ip" | "userAgent">,
  ) {
    let admin = await this.adminRepository.findByEmail(credentials.email);

    if (!admin) {
      if (
        credentials.email !== env.ADMIN_EMAIL ||
        credentials.password !== env.ADMIN_PASSWORD
      ) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "Invalid admin credentials",
        );
      }

      const password = await bcrypt.hash(env.ADMIN_PASSWORD, 10);
      admin = await this.adminRepository.createAdmin({
        name: "Admin",
        email: env.ADMIN_EMAIL,
        password,
      });
    }

    if (admin.role !== "admin") {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid admin credentials");
    }

    const validPassword = await bcrypt.compare(
      credentials.password,
      admin.password,
    );
    if (!validPassword) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid admin credentials");
    }

    const refreshToken = generateRefreshToken(admin._id.toString());
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const session = await this.adminRepository.createSession({
      ...sessionData,
      user: admin._id,
      refreshTokenHash,
    });
    const accessToken = generateAccessToken(
      admin._id.toString(),
      session._id.toString(),
    );

    return {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(sessionId: string, userId: string): Promise<void> {
    await this.adminRepository.revokeSession(sessionId, userId);
  }
}
