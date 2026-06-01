import { Customer, Cart, Session } from './types';

// In-memory storage for the MVP server
export const customers = new Map<string, Customer>();
export const carts = new Map<string, Cart>();
export const sessions = new Map<string, Session>();

// Email -> userId lookup
export const emailToUserId = new Map<string, string>();
