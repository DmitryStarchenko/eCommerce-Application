import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { customers } from '../common/storage';
import { Customer, Address } from '../common/types';
import { omitPassword } from '../common/utils';

@Injectable()
export class UsersService {
  getById(id: string): Omit<Customer, 'password'> {
    const customer = customers.get(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }

    return omitPassword(customer);
  }

  update(
    id: string,
    version: number,
    actions: { action: string; [key: string]: unknown }[],
  ): Omit<Customer, 'password'> {
    const customer = customers.get(id);
    if (!customer) {
      throw new NotFoundException(`Customer with id "${id}" not found`);
    }

    if (customer.version !== version) {
      throw new BadRequestException(
        `Version mismatch: expected ${customer.version}, got ${version}`,
      );
    }

    for (const action of actions) {
      this.applyAction(customer, action);
    }

    customer.version += 1;
    customers.set(id, customer);

    return omitPassword(customer);
  }

  private applyAction(
    customer: Customer,
    action: { action: string; [key: string]: unknown },
  ): void {
    switch (action.action) {
      case 'setFirstName':
        customer.firstName = (action.firstName as string) || '';
        break;
      case 'setLastName':
        customer.lastName = (action.lastName as string) || '';
        break;
      case 'changeEmail':
        customer.email = (action.email as string) || customer.email;
        break;
      case 'setDateOfBirth':
        customer.dateOfBirth = (action.dateOfBirth as string) || '';
        break;
      case 'addAddress':
        this.addAddress(customer, action.address as Partial<Address>);
        break;
      case 'changeAddress':
        this.changeAddress(
          customer,
          action.addressId as string,
          action.address as Partial<Address>,
        );
        break;
      case 'removeAddress':
        this.removeAddress(customer, action.addressId as string);
        break;
      case 'setDefaultShippingAddress':
        customer.defaultShippingAddressId = action.addressId as string;
        break;
      case 'setDefaultBillingAddress':
        customer.defaultBillingAddressId = action.addressId as string;
        break;
      default:
        throw new BadRequestException(`Unknown action: ${action.action}`);
    }
  }

  private addAddress(customer: Customer, address: Partial<Address>): void {
    const newAddress: Address = {
      id: uuidv4(),
      streetName: address.streetName || '',
      streetNumber: address.streetNumber,
      postalCode: address.postalCode,
      city: address.city || '',
      country: address.country || '',
    };
    customer.addresses.push(newAddress);

    // Set as default if first address
    if (customer.addresses.length === 1) {
      customer.defaultShippingAddressId = newAddress.id;
      customer.defaultBillingAddressId = newAddress.id;
    }
  }

  private changeAddress(
    customer: Customer,
    addressId: string,
    address: Partial<Address>,
  ): void {
    const index = customer.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      throw new NotFoundException(`Address with id "${addressId}" not found`);
    }

    customer.addresses[index] = {
      ...customer.addresses[index],
      ...address,
      id: addressId,
    };
  }

  private removeAddress(customer: Customer, addressId: string): void {
    const index = customer.addresses.findIndex((a) => a.id === addressId);
    if (index === -1) {
      throw new NotFoundException(`Address with id "${addressId}" not found`);
    }

    customer.addresses.splice(index, 1);

    // Reset defaults if removed
    if (customer.defaultShippingAddressId === addressId) {
      customer.defaultShippingAddressId = undefined;
    }
    if (customer.defaultBillingAddressId === addressId) {
      customer.defaultBillingAddressId = undefined;
    }
  }
}
