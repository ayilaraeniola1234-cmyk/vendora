import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(vendorId: string, data: {
    customerName: string;
    customerPhone?: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let customer = await this.prisma.customer.findFirst({
      where: { vendorId, phone: data.customerPhone }
    });

    if (!customer) {
      customer = await this.prisma.customer.create({
        data: { vendorId, name: data.customerName, phone: data.customerPhone }
      });
    }

    const order = await this.prisma.order.create({
      data: {
        vendorId,
        customerId: customer.id,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: { items: true, customer: true }
    });

    for (const item of data.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return order;
  }

  async findAll(vendorId: string) {
    return this.prisma.order.findMany({
      where: { vendorId },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }

  async getStats(vendorId: string) {
    const orders = await this.prisma.order.findMany({
      where: { vendorId }
    });

    const revenue = orders
      .filter(o => o.status === 'PAID' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0);

    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'DELIVERED').length;
    const pending = orders.filter(o => o.status === 'PENDING_PAYMENT').length;

    return { revenue, total, delivered, pending };
  }
}