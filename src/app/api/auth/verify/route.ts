import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      valid: true,
      payload,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token', valid: false },
      { status: 401 }
    );
  }
}
