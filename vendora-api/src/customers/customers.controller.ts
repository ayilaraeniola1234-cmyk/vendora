import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post(':vendorId')
  create(@Param('vendorId') vendorId: string, @Body() body: {
    name: string;
    phone?: string;
    email?: string;
  }) {
    return this.customersService.create(vendorId, body);
  }

  @Get(':vendorId')
  findAll(@Param('vendorId') vendorId: string) {
    return this.customersService.findAll(vendorId);
  }

  @Get(':vendorId/stats')
  getStats(@Param('vendorId') vendorId: string) {
    return this.customersService.getStats(vendorId);
  }

  @Get('detail/:id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }
}