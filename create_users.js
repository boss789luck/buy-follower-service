const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  // Upsert Admin
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password, role: 'ADMIN', balance: 9999 },
    create: {
      username: 'admin',
      email: 'admin@nspanel.com',
      password: password,
      role: 'ADMIN',
      balance: 9999
    }
  });

  // Upsert Test User
  await prisma.user.upsert({
    where: { username: 'user1' },
    update: { password, role: 'USER', balance: 0 },
    create: {
      username: 'user1',
      email: 'user1@nspanel.com',
      password: password,
      role: 'USER',
      balance: 0
    }
  });

  console.log('Users created/updated successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
