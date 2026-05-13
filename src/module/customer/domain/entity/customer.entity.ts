type CustomerProps = {
  id?: string;
  name: string;
  phone: string;
  address: string;
  registeredAt: Date;
  isActive: boolean;
};

export class CustomerEntity {
  constructor(private readonly props: CustomerProps) {}

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get phone() {
    return this.props.phone;
  }

  get address() {
    return this.props.address;
  }

  get registeredAt() {
    return this.props.registeredAt;
  }

  get isActive() {
    return this.props.isActive;
  }
}
