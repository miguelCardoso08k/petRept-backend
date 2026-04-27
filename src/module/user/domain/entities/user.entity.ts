import { UserRoleEnum } from '../enums/role-user.enum';

type UserProps = {
  id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: UserRoleEnum;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity {
  constructor(private readonly props: UserProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get role() {
    return this.props.role;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
