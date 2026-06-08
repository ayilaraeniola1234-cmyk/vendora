import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, businessName: string, whatsapp: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(password, 10);
    const slug = businessName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        vendor: {
          create: { businessName, whatsapp, slug }
        }
      },
      include: { vendor: true }
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, vendor: user.vendor };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { vendor: true }
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, vendor: user.vendor };
  }
}