import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
}
