import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProgress = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const progress = await prisma.progress.findUnique({
      where: {
        userId: user.id,
        postId: id
      }
    });

    if (!progress) {
      const newProgress = await prisma.progress.create({
        data: {
          userId: user.id,
          postId: id
        }
      });

      return res.status(200).json(newProgress);
    }

  return res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: "Error getting progress", error});
    console.error(e);
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { progress } = req.body;

    const updatedProgress = await prisma.progress.update({
      where: {
        userId: user.id,
        postId: id
      },
      data: {
        progress
      }
    });

    return res.status(200).json(updatedProgress);
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error });
    console.error(error);
  }
};