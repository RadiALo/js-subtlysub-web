import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import sendEmail from '../smtp.js';

const prisma = new PrismaClient();

export const verificationCodes = new Map();
export const resendTimers = new Map();
export const resendCooldown = 600;
export const verificationCodeExpiration = 3600;

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    const safeUsers = users.map(({ password, ...userData }) => userData);
    res.status(200).json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    res.status(200).json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const getVerifyCode = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "User is already verified" });
    }
    
    const now = Date.now();
    const lastRequestTime = resendTimers.get(id) || 0;

    if (lastRequestTime && now - lastRequestTime < resendCooldown * 1000) {
      return res.status(429).json({ message: "Please wait before requesting another code" });
    }

    const randomCode = Math.floor(100000 + Math.random() * 900000);
    console.log(`Verification code for user ${id}: ${randomCode}`);
    sendEmail(randomCode, user.email, user.username);
    verificationCodes.set(id, {
      code: randomCode,
      expiresAt: now + 3600 * 1000,
    });

    resendTimers.set(id, now);

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
    console.log(error);
  }
};

export const verifyCode = async (req, res) => {
  try {
    const { id } = req.user;
    const { code } = req.body;

    console.log(`Verifying code for user ${id}: ${code}`);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const stored = verificationCodes.get(id);

    if (!stored) {
      return res.status(400).json({ message: "No verification code found. Please request a new one." });
    }

    const now = Date.now();

    if (stored.expiresAt < now) {
      verificationCodes.delete(id);
      return res.status(400).json({ message: "Verification code expired. Please request a new one." });
    }

    if (parseInt(code) !== stored.code) {
      return res.status(400).json({ message: "Incorrect verification code." });
    }

    await prisma.user.update({
      where: { id },
      data: { verified: true },
    });

    verificationCodes.delete(id);
    resendTimers.delete(id);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: "user", verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );
    
    res.status(200).json({ result: "Verify successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verifying user", error });
  }
};