import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateEmailUserDto {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
