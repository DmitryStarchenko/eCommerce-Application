import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { customers, sessions, carts, emailToUserId } from '../common/storage';
import {
  Customer,
  Session,
  TokenPair,
  RegisterRequest,
  LoginRequest,
  ChangePasswordRequest,
  Cart,
} from '../common/types';
import { omitPassword } from '../common/utils';

const TOKEN = { ACCESS: 3600, REFRESH: 604800, ANONYMOUS: 86400 } as const;

type AuthResult = {
  customer: Omit<Customer, 'password'>;
  cart: { id: string; version: number };
  tokens: TokenPair;
};
type AnonToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
};

const emptyCart = (userId?: string): Cart => ({
  id: uuidv4(),
  version: 1,
  userId,
  lineItems: [],
  totalPrice: { currencyCode: 'USD', centAmount: 0 },
  totalLineItemQuantity: 0,
  discountCodes: [],
});

const sessionData = (
  userId: string | null,
  type: 'anonymous' | 'customer',
  ttl: number,
) => {
  const now = new Date();
  return {
    userId,
    type,
    createdAt: now,
    expiresAt: new Date(now.getTime() + ttl * 1000),
  };
};

@Injectable()
export class AuthService {
  createAnonymousToken(): AnonToken {
    const [at, rt] = [uuidv4(), uuidv4()];
    sessions.set(at, sessionData(null, 'anonymous', TOKEN.ANONYMOUS));
    sessions.set(rt, sessionData(null, 'anonymous', TOKEN.REFRESH));
    return {
      access_token: at,
      expires_in: TOKEN.ANONYMOUS,
      refresh_token: rt,
      refresh_expires_in: TOKEN.REFRESH,
    };
  }

  async register(body: RegisterRequest): Promise<AuthResult> {
    const { email, password, firstName, lastName, dateOfBirth, addresses } =
      body;
    if (!email || !password)
      throw new BadRequestException('Email and password are required');
    if (emailToUserId.has(email.toLowerCase()))
      throw new ConflictException('Email already exists');

    const customer: Customer = {
      id: uuidv4(),
      version: 1,
      email,
      password: await bcrypt.hash(password, 10),
      firstName: firstName || '',
      lastName: lastName || '',
      dateOfBirth: dateOfBirth || '',
      addresses: (addresses || []).map((a) => ({
        id: uuidv4(),
        streetName: a.streetName,
        streetNumber: a.streetNumber,
        postalCode: a.postalCode,
        city: a.city,
        country: a.country,
      })),
    };
    customers.set(customer.id, customer);
    emailToUserId.set(email.toLowerCase(), customer.id);

    const cart = emptyCart(customer.id);
    carts.set(cart.id, cart);
    return {
      customer: omitPassword(customer),
      cart: { id: cart.id, version: cart.version },
      tokens: this.generateCustomerTokens(customer.id),
    };
  }

  async login(body: LoginRequest): Promise<AuthResult> {
    const { email, password } = body;
    if (!email || !password)
      throw new BadRequestException('Email and password are required');

    const userId = emailToUserId.get(email.toLowerCase());
    const customer = userId ? customers.get(userId) : undefined;
    if (!customer || !(await bcrypt.compare(password, customer.password)))
      throw new UnauthorizedException('Invalid email or password');

    let cart = [...carts.values()].find((c) => c.userId === userId);
    if (!cart) {
      cart = emptyCart(userId);
      carts.set(cart.id, cart);
    }
    return {
      customer: omitPassword(customer),
      cart: { id: cart.id, version: cart.version },
      tokens: this.generateCustomerTokens(userId!),
    };
  }

  async changePassword(
    body: ChangePasswordRequest,
  ): Promise<Omit<Customer, 'password'>> {
    const { id, currentPassword, newPassword } = body;
    const customer = customers.get(id);
    if (!customer) throw new NotFoundException('Customer not found');
    if (!(await bcrypt.compare(currentPassword, customer.password)))
      throw new BadRequestException('Current password is incorrect');

    customer.password = await bcrypt.hash(newPassword, 10);
    customer.version++;
    return omitPassword(customer);
  }

  validateToken(token: string): Session | null {
    const session = sessions.get(token);
    if (!session || new Date() > session.expiresAt) {
      sessions.delete(token);
      return null;
    }
    return session;
  }

  refreshToken(refreshToken: string): TokenPair {
    const session = sessions.get(refreshToken);
    if (!session || new Date() > session.expiresAt)
      throw new UnauthorizedException('Invalid or expired refresh token');
    sessions.delete(refreshToken);
    return this.generateCustomerTokens(session.userId);
  }

  private generateCustomerTokens(userId: string | null): TokenPair {
    const [at, rt] = [uuidv4(), uuidv4()];
    const type = userId ? 'customer' : ('anonymous' as const);
    sessions.set(at, sessionData(userId, type, TOKEN.ACCESS));
    sessions.set(rt, sessionData(userId, type, TOKEN.REFRESH));
    return {
      access_token: at,
      refresh_token: rt,
      expires_in: TOKEN.ACCESS,
      refresh_expires_in: TOKEN.REFRESH,
    };
  }
}
