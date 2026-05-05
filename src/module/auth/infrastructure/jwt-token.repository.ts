import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRoleEnum } from 'src/module/user/domain/enums/role-user.enum';
import { TokenRepository } from '../domain/repositories/token.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUserEntity } from '../domain/entities/authenticated-user.entity';
import { randomUUID } from 'crypto';

type AccessTokenPayload = {
  sub: string;
  jti: string;
  email: string;
  role: UserRoleEnum;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtTokenRepository implements TokenRepository {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(user: AuthenticatedUserEntity): Promise<string> {
    const jti = randomUUID();
    // const expiresAt = this.createExpirationDate(); implentar depois a expiração do token e token refresh
    const payload: AccessTokenPayload = {
      sub: user.id,
      jti,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  async verifyAccessToken(token: string): Promise<AuthenticatedUserEntity> {
    let payload: AccessTokenPayload;

    try {
      payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        ignoreExpiration: true,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }

    return new AuthenticatedUserEntity({
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    });
  }

  invalidateToken(token: string): boolean {
    //implementar blacklist de tokens para invalidar o token, por enquanto só retorna true

    if (!token) return false;

    return true;
  }
}
