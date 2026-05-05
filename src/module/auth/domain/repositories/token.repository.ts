import { AuthenticatedUserEntity } from '../entities/authenticated-user.entity';

export abstract class TokenRepository {
  abstract signAccessToken(user: AuthenticatedUserEntity): Promise<string>;
  abstract verifyAccessToken(token: string): Promise<AuthenticatedUserEntity>;
  // abstract invalidateToken(token: string): Promise<boolean>; temporariamente sem async, implementar blacklist de tokens para invalidar o token depois
  abstract invalidateToken(token: string): boolean;
}
