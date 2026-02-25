import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root123',
    database: 'ai_admin',
  });

  // 创建测试用户
  const users = [
    {
      email: 'admin@example.com',
      password: 'admin123',
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
    const [rows] = await connection.execute(
      'SELECT * FROM User WHERE email = ?',
      [user.email]
    );

    // @ts-ignore
    if (rows.length === 0) {
      await connection.execute(
        'INSERT INTO User (email, password, name, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [user.email, user.password, user.name, user.role, user.status]
      );
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  await connection.end();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
