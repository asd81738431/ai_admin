import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/order - 获取所有订单或单个订单
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
      });
      return NextResponse.json(order);
    }

    const orders = await prisma.order.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/order - 创建订单
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_num, user_id, user_name, amount, status } = body;

    const order = await prisma.order.create({
      data: {
        order_num,
        user_id: parseInt(user_id),
        user_name,
        amount,
        status: status || 'active',
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PUT /api/order - 更新订单
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, order_num, user_id, user_name, amount, status } = body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        order_num,
        user_id: parseInt(user_id),
        user_name,
        amount,
        status,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE /api/order - 删除订单
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
