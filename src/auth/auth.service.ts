import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private get secret() {
    return process.env.JWT_SECRET || 'dev-secret';
  }

  private hashPassword(password: string) {
    return createHmac('sha256', 'pwd-salt').update(password).digest('hex');
  }

  private base64Url(input: string) {
    return Buffer.from(input)
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  signToken(payload: Record<string, any>) {
    const header = this.base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = this.base64Url(JSON.stringify(payload));
    const signature = this.base64Url(createHmac('sha256', this.secret).update(`${header}.${body}`).digest('base64'));
    return `${header}.${body}.${signature}`;
  }

  verifyToken(token: string) {
    const [header, body, signature] = token.split('.');
    if (!header || !body || !signature) throw new UnauthorizedException('Invalid token');
    const expected = this.base64Url(createHmac('sha256', this.secret).update(`${header}.${body}`).digest('base64'));
    if (expected !== signature) throw new UnauthorizedException('Invalid signature');
    return JSON.parse(Buffer.from(body, 'base64').toString());
  }

  async register(dto: RegisterDto) {
    return this.usersService.create({ ...dto, password: dto.password }, true);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const hashed = this.hashPassword(dto.password);
    if (hashed !== user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role, displayName: user.displayName };
    return { accessToken: this.signToken(payload), user: payload };
  }
}
