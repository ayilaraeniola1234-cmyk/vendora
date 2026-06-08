import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':vendorId')
  create(@Param('vendorId') vendorId: string, @Body() body: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    stock: number;
    imageUrl?: string;
  }) {
    return this.productsService.create(vendorId, body);
  }

  @Get(':vendorId')
  findAll(@Param('vendorId') vendorId: string) {
    return this.productsService.findAll(vendorId);
  }

  @Get(':vendorId/low-stock')
  getLowStock(@Param('vendorId') vendorId: string) {
    return this.productsService.getLowStock(vendorId);
  }

  @Put(':vendorId/:id')
  update(@Param('id') id: string, @Param('vendorId') vendorId: string, @Body() body: any) {
    return this.productsService.update(id, vendorId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}