import { UserRoleEnum } from 'src/module/user/domain/enums/role-user.enum';

type AuthenticatedUserProps = {
  id: string;
  email: string;
  role: UserRoleEnum;
};

export class AuthenticatedUserEntity {
  constructor(private readonly props: AuthenticatedUserProps) {}

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get role() {
    return this.props.role;
  }
}
