import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../../user/domain/repositories/user.repository';
import { PasswordHasherRepository } from '../domain/repositories/password-hasher.repository';
import { TokenRepository } from '../domain/repositories/token.repository';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PasswordHasherRepository, useValue: {} },
        { provide: UserRepository, useValue: {} },
        { provide: TokenRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
