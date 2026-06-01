import { randomUUID } from 'crypto';
import { Customer } from './types';

export function generateId(): string {
  return randomUUID();
}

export function omitPassword(customer: Customer): Omit<Customer, 'password'> {
  const rest = { ...customer };
  delete rest.password;
  return rest;
}
