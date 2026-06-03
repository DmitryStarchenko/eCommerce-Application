import { randomUUID } from 'crypto';
import { Customer } from './types';

export function generateId(): string {
  return randomUUID();
}

export function omitPassword(customer: Customer): Omit<Customer, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = customer;
  return rest;
}
