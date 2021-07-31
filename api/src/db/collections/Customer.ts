import { Collection } from 'fireorm';

@Collection()
export class Customer {
  id: string;
  name?: string | null;
  email: string;
  phoneNumber?: string | null;
  issuer?: string | null;
  credits: number;
  enabled: boolean;
  publicKeys: string[];
}
