export interface Money {
  currencyCode: string;
  centAmount: number;
}

export interface Price {
  value: Money;
}

export interface Image {
  url: string;
  label: string;
}

export interface Attribute {
  name: string;
  value: string | number;
}

export interface ProductVariant {
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
}

export interface ProductData {
  id: string;
  name: { 'en-US': string };
  description: { 'en-US': string };
  masterVariant: ProductVariant;
}

export interface Product {
  id: string;
  key: string;
  masterData: {
    current: ProductData;
  };
}

export interface DataProduct {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: Product[];
}

export interface Category {
  id: string;
  name: { 'en-US': string };
  key: string;
  productKeys: string[];
}

export interface DiscountCode {
  key: string;
  code: string;
  name: { 'en-US': string };
  discountPercent: number;
}

export interface Customer {
  id: string;
  version: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
}

export interface Address {
  id: string;
  streetName: string;
  streetNumber?: string;
  postalCode?: string;
  city: string;
  country: string;
}

export interface LineItem {
  id: string;
  productId: string;
  name: { 'en-US': string };
  variant: ProductVariant;
  price: Price;
  quantity: number;
  totalPrice: Money;
}

export interface DiscountOnTotalPrice {
  discountedAmount: Money;
}

export interface Cart {
  id: string;
  version: number;
  userId?: string;
  lineItems: LineItem[];
  totalPrice: Money;
  discountOnTotalPrice?: DiscountOnTotalPrice;
  totalLineItemQuantity: number;
  discountCodes: string[];
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface Session {
  userId: string | null;
  type: 'anonymous' | 'customer';
  createdAt: Date;
  expiresAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  addresses?: Omit<Address, 'id'>[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  id: string;
  version: number;
  currentPassword: string;
  newPassword: string;
}

export interface CartUpdateAction {
  action: string;
  productId?: string;
  lineItemId?: string;
  quantity?: number;
  code?: string;
  address?: Address;
  addressId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
}

export interface CartUpdateRequest {
  version: number;
  actions: CartUpdateAction[];
}

export interface UserUpdateAction {
  action: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  address?: Address;
  addressId?: string;
}

export interface UserUpdateRequest {
  version: number;
  actions: UserUpdateAction[];
}
