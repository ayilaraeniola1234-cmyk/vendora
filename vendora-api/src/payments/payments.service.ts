import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly secret = process.env.PAYSTACK_SECRET;
  private readonly baseUrl = 'https://api.paystack.co';

  async initializePayment(email: string, amount: number, orderId: string) {
    const response = await axios.post(
      `${this.baseUrl}/transaction/initialize`,
      {
        email,
        amount: amount * 100,
        reference: `vendora-${orderId}-${Date.now()}`,
        metadata: { orderId },
        callback_url: `http://localhost:3001/payment/verify`,
      },
      {
        headers: {
          Authorization: `Bearer ${this.secret}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await axios.get(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${this.secret}`,
        },
      }
    );
    return response.data;
  }
}