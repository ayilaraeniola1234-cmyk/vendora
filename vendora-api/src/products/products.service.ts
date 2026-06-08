import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(vendorId: string, data: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    stock: number;
    imageUrl?: string;
  }) {
    return this.prisma.product.create({
      data: { vendorId, ...data }
    });
  }

  async findAll(vendorId: string) {
    return this.prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string, vendorId: string) {
    return this.prisma.product.findFirst({
      where: { id, vendorId }
    });
  }

  async update(id: string, vendorId: string, data: Partial<{
    name: string;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    imageUrl: string;
  }>) {
    return this.prisma.product.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async getLowStock(vendorId: string) {
    return this.prisma.product.findMany({
      where: { vendorId, stock: { lte: 5 } },
      orderBy: { stock: 'asc' }
    });
  }
}