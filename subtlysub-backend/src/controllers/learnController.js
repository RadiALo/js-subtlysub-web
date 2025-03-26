import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLearn = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;

    const learn = await prisma.learn.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
    });

    if (!learn) {
      const newLearn = await prisma.learn.create({
        data: {
          userId: user.id,
          postId: id,
        },
      });

      return res.status(200).json(newLearn);
    }

    return res.status(200).json(learn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting progress", error });
  }
};

export const updateLearn = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const { progress } = req.body;

    const updatedLearn = await prisma.learn.update({
      where: {
        userId_postId: {
          userId: user.id,
          postId: id,
        },
      },
      data: {
        progress,
      },
    });

    return res.status(200).json(updatedLearn);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating progress", error });
  }
};
