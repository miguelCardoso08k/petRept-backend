import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  confirmPassword!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
