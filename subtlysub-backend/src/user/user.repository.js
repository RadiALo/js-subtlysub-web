import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UserRepository = {
  findUserById: async (userId) => {
    return await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  },

  findByEmail: async (email) => {
    return await prisma.user.findUnique({ where: { email }, include: { role: true } });
  },

  findByUsername: async (username) => {
    return await prisma.user.findUnique({ where: { username }, include: { role: true } });
  },

  create: async (userData) => {
    const user = await prisma.user.create({ data: userData, include: { role: true } });

    await prisma.collection.create({
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

    return user;
  },

  updateVerificationStatus: async (id, verified) => {
    return prisma.user.update({
      where: { id },
      data: { verified },
    });
  },

  getAll: async () => {
    return prisma.user.findMany({ include: { role: true } });
  },
};

export default UserRepository;
