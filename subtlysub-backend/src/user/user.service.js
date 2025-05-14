import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import sendEmail from "../smtp.js";
import jwt from "jsonwebtoken";

const UserService = {
  verificationCodes: new Map(),
  resendCooldown: 600,
  verificationCodeExpiration: 3600,

  toResponseDTO: (user) => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      verified: user.verified,
      role: user.role.name,
    };
  },

  register: async (data) => {
    const { password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    return UserService.toResponseDTO(user);
  },

  login: async (data) => {
    const { username, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role.name,
        verified: user.verified,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return token;
  },

  getUsers: async () => {
    const users = await UserRepository.getAll();
    return users.map(UserService.toResponseDTO);
  },

  getUserById: async (id) => {
    const user = await UserRepository.findUserById(id);

    if (!user) {
      return null;
    }

    return UserService.toResponseDTO(user);
  },

  getUserByEmail: async (email) => {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    return UserService.toResponseDTO(user);
  },

  getUserByUsername: async (username) => {
    const user = await UserRepository.findByUsername(username);

    if (!user) {
      return null;
    }

    return UserService.toResponseDTO(user);
  },

  sendVerifyCode: async (id) => {
    const user = await UserRepository.findUserById(id);

    if (!user) {
      return null;
    }

    const now = Date.now();
    const stored = UserService.verificationCodes.get(id);

    if (stored && stored.createdAt + UserService.resendCooldown * 1000 < now) {
      return null;
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    sendEmail(randomCode, user.email, user.username);

    UserService.verificationCodes.set(id, {
      code: randomCode,
      expiresAt: now + UserService.verificationCodeExpiration * 1000,
      createdAt: now,
    });
  },

  verifyCode: async (id, code) => {
    const user = await UserRepository.findUserById(id);

    if (!user) {
      return null;
    }

    const now = Date.now();
    const stored = UserService.verificationCodes.get(id);
    
    if (!stored || stored.code !== Number(code)) {
      return null;
    }

    if (stored.expiresAt < now) {
      UserService.verificationCodes.delete(id);
      return null;
    }

    await UserRepository.updateVerificationStatus(id, true);
    UserService.verificationCodes.delete(id);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role.name,
        verified: true,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    return token;
  },
};

export default UserService;