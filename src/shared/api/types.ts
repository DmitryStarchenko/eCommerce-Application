export interface BodyLogin {
  email: string;
  password: string;
}

interface Addresses {
  id: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface BodySignUp {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: Addresses[];
  defaultShippingAddress: number;
  defaultBillingAddress: number;
  dateOfBirth: string;
  store: string;
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface CustomerAllInfo {
  statusCode: number;
  message: string;
  customer: Customer;
  cart: CustomerCart;
}

export interface Customer {
  message?: string;
  id: string;
  version: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Addresses[];
  defaultShippingAddressIds: string;
  defaultbillingAddressIds: string;
}

export interface Cart {
  id: string;
  version: number;
  lineItems: ProductInCart[];
  totalPrice: Value;
  discountOnTotalPrice?: {
    discountedAmount: Value;
  };
  totalLineItemQuantity: number;
}

export interface Name {
  "en-US": string;
}

export interface Description {
  "en-US": string;
}

export interface Prices {
  value: Value;
  discounted?: Prices;
}

export interface Value {
  currencyCode: string;
  centAmount: number;
}

export interface Images {
  url: string;
  label: string;
}

export interface Attributes {
  name: string;
  value: number | string;
}

export interface MasterVariant {
  prices: Prices[];
  images: Images[];
  attributes: Attributes[];
}

export interface MasterData {
  id: string;
  key: string;
  masterData: {
    current: {
      id: string;
      name: Name;
      description: Description;
      masterVariant: MasterVariant;
    };
  };
}

export interface Product {
  id: string;
  key: string;
  name: Name;
  description: Description;
  masterVariant: MasterVariant;
}

export interface ProductDetail {
  id: string;
  key: string;
  masterData: {
    current: {
      id: string;
      name: Name;
      description: Description;
      masterVariant: MasterVariant;
    };
  };
}

export type ProductDetailsList = ProductDetail[];

export interface ProductInCart {
  id: string;
  productId: string;
  name: Name;
  variant: MasterVariant;
  price: Prices;
  quantity: number;
  totalPrice: Value;
}

export interface CustomerCart {
  id: string;
  version: number;
}

export interface DataProduct {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: MasterData[];
}
