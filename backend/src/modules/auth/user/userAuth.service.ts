import { UserRepository } from "@modules/auth/user/userAuth.repository.js";
import type { SessionType } from "@modules/auth/models/session.model.js";
import { HTTP_STATUS } from "@shared/httpcode.js";
import { ApiError } from "@utils/apiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@utils/jwt.js";
import bcrypt from "bcrypt";
import type {
  UserLoginInput,
  UserRegisterInput,
} from "./userAuth.validation.js";

export class UserService {
  private userRepository;
  constructor(userRepo = new UserRepository()) {
    this.userRepository = userRepo;
  }

  private sanitizeUser(user: any) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  //todo: register user
  async register(userData: UserRegisterInput) {
    const existUser = await this.userRepository.findByEmail(userData.email);
    if (existUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User already exist");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const data = { ...userData, password: hashedPassword };

    const createUser = await this.userRepository.createUser(data);
    const refreshToken = generateRefreshToken(
      createUser._id.toString(),
      createUser.role,
    );

    const accessToken = generateAccessToken(
      createUser._id.toString(),
      createUser.role,
    );

    return {
      user: this.sanitizeUser(createUser),
      refreshToken,
      accessToken,
    };
  }

  //todo: login
  async login(userData: UserLoginInput) {
    const existUser = await this.userRepository.findByEmail(userData.email);
    if (!existUser) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid email or password");
    }

    const compare = await bcrypt.compare(userData.password, existUser.password);
    if (!compare) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Wrong email or password");
    }
    const refreshToken = generateRefreshToken(
      existUser._id.toString(),
      existUser.role,
    );

    const accessToken = generateAccessToken(
      existUser._id.toString(),
      existUser.role,
    );

    return {
      user: this.sanitizeUser(existUser),
      refreshToken,
      accessToken,
    };
  }

  //todo:refresh token
  async refreshAccessToken(
    oldRefreshToken: string,
  ) {
    if (!oldRefreshToken) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required");
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(oldRefreshToken);
    } catch {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired refresh token",
      );
    }

    if (!decoded._id) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    const user = await this.userRepository.findById(decoded._id);

    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User no longer exists");
    }

    const refreshToken = generateRefreshToken(user._id.toString(), user.role);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const accessToken = generateAccessToken(user._id.toString(), user.role);

    return {
      user: this.sanitizeUser(user),
      refreshToken,
      accessToken,
    };
  }

  //todo: logout
  async logout(refreshToken: string, userId: string) {
    let decoded;

    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }

    if (!decoded._id || decoded._id !== userId) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    }
  }
}
