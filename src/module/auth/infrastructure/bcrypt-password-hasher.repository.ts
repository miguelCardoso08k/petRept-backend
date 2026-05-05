import { Injectable } from '@nestjs/common';
import { PasswordHasherRepository } from '../domain/repositories/password-hasher.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptPasswordHasherRepository implements PasswordHasherRepository {
  async compare(plainText: string, hash: string): Promise<boolean> {
    if (!hash.startsWith('$2')) return plainText === hash;

    return await bcrypt.compare(plainText, hash);
  }

  async hash(plainText: string): Promise<string> {
    return await bcrypt.hash(plainText, 10);
  }
}
