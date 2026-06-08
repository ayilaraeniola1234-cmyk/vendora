import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('initialize')
  async initialize(@Body() body: { email: string; amount: number; orderId: string }) {
    return this.paymentsService.initializePayment(body.email, body.amount, body.orderId);
  }

  @Get('verify/:reference')
  async verify(@Param('reference') reference: string) {
    const result = await this.paymentsService.verifyPayment(reference);
    if (result.data?.status === 'success') {
      const orderId = result.data.metadata?.orderId;
      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        });
      }
    }
    return result;
  }
}