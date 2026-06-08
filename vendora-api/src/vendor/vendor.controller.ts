import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('profile/:userId')
  getProfile(@Param('userId') userId: string) {
    return this.vendorService.getProfile(userId);
  }

  @Get('dashboard/:userId')
  getDashboard(@Param('userId') userId: string) {
    return this.vendorService.getDashboard(userId);
  }

  @Get('slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.vendorService.getBySlug(slug);
  }

  @Put('profile/:userId')
  updateProfile(@Param('userId') userId: string, @Body() body: {
    businessName?: string;
    whatsapp?: string;
    logoUrl?: string;
  }) {
    return this.vendorService.updateProfile(userId, body);
  }
}