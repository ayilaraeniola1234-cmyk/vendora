import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: 'postgresql://vendora:vendora123@localhost:5432/vendora_db',
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}