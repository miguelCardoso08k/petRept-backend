export abstract class PasswordHasherRepository {
  abstract compare(plainText: string, hash: string): Promise<boolean>;
  abstract hash(plainText: string): Promise<string>;
}
