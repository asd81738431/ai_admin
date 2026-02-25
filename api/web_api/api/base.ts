import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// 硬编码的用户凭证
const HARDCODED_USER = {
  email: 'admin@example.com',
  password: 'admin123'
};

export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export async function Login(request: Request): Promise<Response> {
  try {
    const loginModel: LoginModel = await request.json();

    // 验证凭证
    if (loginModel.email !== HARDCODED_USER.email || loginModel.password !== HARDCODED_USER.password) {
      return Response.json({
        success: false,
        message: '邮箱或密码错误'
      }, { status: 401 });
    }

    // 生成 JWT token
    const token = await new SignJWT({
      email: loginModel.email,
      role: 'admin'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return Response.json({
      success: true,
      token
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: '服务器错误'
    }, { status: 500 });
  }
}

// 验证 JWT token 的辅助函数
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}