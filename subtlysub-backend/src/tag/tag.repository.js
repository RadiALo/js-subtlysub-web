import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TagRepository = {
  getAll: async () => {
    return await prisma.tag.findMany();
  },
};

export default TagRepository;