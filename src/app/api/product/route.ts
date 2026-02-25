import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/product - 获取所有产品或单个产品
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(product);
    }

    const products = await prisma.product.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/product - 创建产品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, amount, num, status } = body;

    const product = await prisma.product.create({
      data: {
        name,
        category,
        amount: parseInt(amount),
        num: parseInt(num),
        status: status || 'active',
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT /api/product - 更新产品
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, category, amount, num, status } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        amount: parseInt(amount),
        num: parseInt(num),
        status,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/product - 删除产品
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
