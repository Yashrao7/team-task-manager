const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, email: true }
  });
  console.log('USERS:', JSON.stringify(users, null, 2));

  const projects = await prisma.project.findMany({
    include: { members: true }
  });
  console.log('PROJECTS:', JSON.stringify(projects, null, 2));

  const members = await prisma.projectMember.findMany();
  console.log('PROJECT_MEMBERS:', JSON.stringify(members, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
