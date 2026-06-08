import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':vendorId')
  create(@Param('vendorId') vendorId: string, @Body() body: {
    customerName: string;
    customerPhone?: string;
    items: { productId: string; quantity: number; price: number }[];
  }) {
    return this.ordersService.create(vendorId, body);
  }

  @Get(':vendorId')
  findAll(@Param('vendorId') vendorId: string) {
    return this.ordersService.findAll(vendorId);
  }

  @Get(':vendorId/stats')
  getStats(@Param('vendorId') vendorId: string) {
    return this.ordersService.getStats(vendorId);
  }

  @Put(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: OrderStatus }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}