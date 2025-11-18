import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'test@pome.com' },
  });
  console.log('Test User ID:', user?.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
