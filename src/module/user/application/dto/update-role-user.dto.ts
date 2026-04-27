import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRoleEnum } from '../../domain/enums/role-user.enum';

export class UpdateRoleUserDto {
  @IsNotEmpty()
  @IsEnum(UserRoleEnum)
  role!: UserRoleEnum;
}
