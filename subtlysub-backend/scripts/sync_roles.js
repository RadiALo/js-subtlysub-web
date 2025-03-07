import { PrismaClient } from '@prisma/client';

const list = ['user', 'moderator', 'admin'];
const prisma = new PrismaClient();

async function seedRoles() {
  for (const role of list) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},  
      create: { name: role },
    });
  }

  const roles = await prisma.role.findMany();
  console.log(roles);

  await prisma.$disconnect();
}

seedRoles()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
