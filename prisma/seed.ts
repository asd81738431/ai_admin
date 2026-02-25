import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  // 创建测试用户
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123', // 生产环境应该使用加密的密码
      name: '管理员',
      role: 'admin',
      status: 'active',
    },
    {
      email: 'user@example.com',
      password: 'user123',
      name: '普通用户',
      role: 'user',
      status: 'active',
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: user,
      });
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
