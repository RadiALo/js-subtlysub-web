import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LearnRepository = {
  find: async (userId, postId) => {
    const learn = await prisma.learn.findUnique({
      where: {
        userId,
        postId
      }
    });

    return learn;
  },

  create: async (userId, postId) => {
    const newLearn = await prisma.learn.create({
      data: {
        userId,
        postId
      }
    });

    return newLearn;
  },

  update: async (learn) => {
    const updatedLearn = await prisma.learn.update({
      where: {
        userId: learn.userId,
        postId: learn.postId
      },
      data: {
        progress: learn.progress,
        updatedAt: new Date()
      }
    });

    return updatedLearn;
  },
};

export default LearnRepository;