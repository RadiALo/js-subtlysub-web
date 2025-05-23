import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const prisma = new PrismaClient();

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role.name, verified: user.verified },
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    res.status(200).json({ result: "Login successful", token });
  } catch {
    console.error(error);
    res.status(500).json({ message: "Error during login" });
  }
};

export const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const alreadyExist = await prisma.user.findFirst({
      where: {
        OR: [
          { username }, 
          { email }
        ]
      }
    });

    if (alreadyExist) {
      return res.status(409).json({ message: "Username or email already exists"})
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const { password: _, ...safeUser } = user;

    const favoriteCollection = await prisma.collection.create({
      data: {
        name: "Favorites",
        description: "Your favorite posts",
        imageUrl: "/uploads/favorites.png",
        owner: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    res.status(201).json(safeUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user"});
  }
};