import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error getting tags", error });
  }
};