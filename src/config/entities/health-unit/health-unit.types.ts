export interface IHealthUnit {
  _id: string;
  name: string;
  address: IHealthUnitAddress;
  description: string;
  services: IService[];
  phone: string;
  email: string;
  img?: string;
  createdAt: Date;
}
export interface IService {
  _id: string;
  name: string;
  description?: string;
  duration?: number; //minutes
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IHealthUnitAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}
