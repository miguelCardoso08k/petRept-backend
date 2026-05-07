import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenRepository } from '../../domain/repositories/token.repository';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthenticatedRequest } from '../../../../core/shared/http/interfaces/authenticated-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TokenRepository) private readonly tokenRepository: TokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) throw new UnauthorizedException('Access token is missing');

    const authenticatedUser =
      await this.tokenRepository.verifyAccessToken(token);

    request.user = authenticatedUser;
    request.token = token;

    return true;
  }

  private extractBearerToken(request: AuthenticatedRequest) {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return null;

    const [scheme, token] = authorizationHeader.split(' ');

    if (scheme !== 'Bearer' || !token) return null;

    return token;
  }
}
