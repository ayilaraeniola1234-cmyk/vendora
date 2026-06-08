import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(vendorId: string, data: {
    name: string;
    phone?: string;
    email?: string;
  }) {
    return this.prisma.customer.create({
      data: { vendorId, ...data }
    });
  }

  async findAll(vendorId: string) {
    return this.prisma.customer.findMany({
      where: { vendorId },
      include: { orders: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: { orders: { include: { items: true } } }
    });
  }

  async getStats(vendorId: string) {
    const customers = await this.prisma.customer.findMany({
      where: { vendorId },
      include: { orders: true }
    });

    const total = customers.length;
    const vip = customers.filter(c => c.orders.length >= 3).length;
    const repeat = customers.filter(c => c.orders.length >= 2).length;
    const inactive = customers.filter(c => c.orders.length === 0).length;

    return { total, vip, repeat, inactive };
  }
}