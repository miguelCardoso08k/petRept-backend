import { AuthenticatedUserEntity } from '../../domain/entities/authenticated-user.entity';

export class AuthMapper {
  static toHttp(user: AuthenticatedUserEntity) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
