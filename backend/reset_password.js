const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.update({
    where: { email: 'yashydv9313@gmail.com' },
    data: { password: hashedPassword }
  });
  
  console.log(`Password reset for ${user.email} to 'password123'`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
