import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class VendorService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        products: { orderBy: { createdAt: 'desc' }, take: 5 },
        orders: { orderBy: { createdAt: 'desc' }, take: 5 },
        customers: true,
      }
    });
  }

  async updateProfile(userId: string, data: Partial<{
    businessName: string;
    whatsapp: string;
    logoUrl: string;
  }>) {
    return this.prisma.vendor.update({
      where: { userId },
      data
    });
  }

  async getDashboard(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) return null;

    const vendorId = vendor.id;

    const [totalProducts, totalCustomers, orders] = await Promise.all([
      this.prisma.product.count({ where: { vendorId } }),
      this.prisma.customer.count({ where: { vendorId } }),
      this.prisma.order.findMany({ where: { vendorId } }),
    ]);

    const revenue = orders
      .filter(o => o.status === 'PAID' || o.status === 'DELIVERED')
      .reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'INQUIRY' || o.status === 'PENDING_PAYMENT').length;

    const lowStock = await this.prisma.product.findMany({
      where: { vendorId, stock: { lte: 5 } },
      orderBy: { stock: 'asc' }
    });

    return {
      vendor,
      stats: { revenue, totalOrders, totalProducts, totalCustomers, pendingOrders },
      lowStock,
    };
  }

  async getBySlug(slug: string) {
    return this.prisma.vendor.findUnique({ where: { slug } });
  }
}