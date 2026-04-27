import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNameUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
