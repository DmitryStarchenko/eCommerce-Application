import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { carts } from '../common/storage';
import { Cart, LineItem } from '../common/types';
import { ProductsService } from '../products/products.service';
import { discountsData } from '../data/discounts.data';

const CURRENCY = 'USD';

@Injectable()
export class CartsService {
  constructor(private readonly productsService: ProductsService) {}

  create(userId?: string): Cart {
    const cart: Cart = {
      id: uuidv4(),
      version: 1,
      userId,
      lineItems: [],
      totalPrice: { currencyCode: CURRENCY, centAmount: 0 },
      totalLineItemQuantity: 0,
      discountCodes: [],
    };

    carts.set(cart.id, cart);
    return cart;
  }

  getById(id: string): Cart {
    const cart = carts.get(id);
    if (!cart) {
      throw new NotFoundException(`Cart with id "${id}" not found`);
    }
    return cart;
  }

  delete(id: string): void {
    if (!carts.has(id)) {
      throw new NotFoundException(`Cart with id "${id}" not found`);
    }
    carts.delete(id);
  }

  update(
    id: string,
    version: number,
    actions: { action: string; [key: string]: unknown }[],
  ): Cart {
    const cart = this.getById(id);

    if (cart.version !== version) {
      throw new BadRequestException(
        `Version mismatch: expected ${cart.version}, got ${version}`,
      );
    }

    for (const action of actions) {
      this.applyAction(cart, action);
    }

    cart.version += 1;
    this.recalculateCart(cart);
    carts.set(id, cart);
    return cart;
  }

  private applyAction(
    cart: Cart,
    action: { action: string; [key: string]: unknown },
  ): void {
    switch (action.action) {
      case 'addLineItem':
        this.addLineItem(
          cart,
          action.productId as string,
          action.quantity as number | undefined,
        );
        break;
      case 'removeLineItem':
        this.removeLineItem(
          cart,
          action.lineItemId as string,
          action.quantity as number | undefined,
        );
        break;
      case 'changeLineItemQuantity':
        this.changeLineItemQuantity(
          cart,
          action.lineItemId as string,
          action.quantity as number,
        );
        break;
      case 'addDiscountCode':
        this.addDiscountCode(cart, action.code as string);
        break;
      case 'removeDiscountCode':
        this.removeDiscountCode(cart);
        break;
      default:
        throw new BadRequestException(`Unknown action: ${action.action}`);
    }
  }

  private addLineItem(cart: Cart, productId: string, quantity?: number): void {
    const product = this.productsService.getById(productId);
    if (!product) {
      throw new NotFoundException(`Product with id "${productId}" not found`);
    }

    const qty = quantity ?? 1;
    const existingItem = cart.lineItems.find(
      (li) => li.productId === productId,
    );

    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.totalPrice = {
        currencyCode: CURRENCY,
        centAmount: existingItem.price.value.centAmount * existingItem.quantity,
      };
    } else {
      const price = product.masterData.current.masterVariant.prices[0];
      const lineItem: LineItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.masterData.current.name,
        variant: product.masterData.current.masterVariant,
        price,
        quantity: qty,
        totalPrice: {
          currencyCode: CURRENCY,
          centAmount: price.value.centAmount * qty,
        },
      };
      cart.lineItems.push(lineItem);
    }
  }

  private removeLineItem(
    cart: Cart,
    lineItemId: string,
    quantity?: number,
  ): void {
    const index = cart.lineItems.findIndex((li) => li.id === lineItemId);
    if (index === -1) {
      throw new NotFoundException(`LineItem with id "${lineItemId}" not found`);
    }

    if (quantity && quantity < cart.lineItems[index].quantity) {
      cart.lineItems[index].quantity -= quantity;
      cart.lineItems[index].totalPrice = {
        currencyCode: CURRENCY,
        centAmount:
          cart.lineItems[index].price.value.centAmount *
          cart.lineItems[index].quantity,
      };
    } else {
      cart.lineItems.splice(index, 1);
    }
  }

  private changeLineItemQuantity(
    cart: Cart,
    lineItemId: string,
    quantity: number,
  ): void {
    const lineItem = cart.lineItems.find((li) => li.id === lineItemId);
    if (!lineItem) {
      throw new NotFoundException(`LineItem with id "${lineItemId}" not found`);
    }

    if (quantity <= 0) {
      cart.lineItems = cart.lineItems.filter((li) => li.id !== lineItemId);
    } else {
      lineItem.quantity = quantity;
      lineItem.totalPrice = {
        currencyCode: CURRENCY,
        centAmount: lineItem.price.value.centAmount * quantity,
      };
    }
  }

  private addDiscountCode(cart: Cart, code: string): void {
    const discount = discountsData.find(
      (d) => d.code.toLowerCase() === code.toLowerCase(),
    );
    if (!discount) {
      throw new NotFoundException(`Discount code "${code}" not found`);
    }

    if (!cart.discountCodes.includes(code)) {
      cart.discountCodes.push(code);
    }
  }

  private removeDiscountCode(cart: Cart): void {
    cart.discountCodes = [];
    cart.discountOnTotalPrice = undefined;
  }

  private recalculateCart(cart: Cart): void {
    const totalCentAmount = cart.lineItems.reduce(
      (sum, li) => sum + li.totalPrice.centAmount,
      0,
    );

    cart.totalPrice = { currencyCode: CURRENCY, centAmount: totalCentAmount };
    cart.totalLineItemQuantity = cart.lineItems.reduce(
      (sum, li) => sum + li.quantity,
      0,
    );

    // Apply discount if any
    if (cart.discountCodes.length > 0) {
      const discount = discountsData.find((d) =>
        cart.discountCodes.includes(d.code),
      );
      if (discount) {
        const discountedAmount = Math.round(
          totalCentAmount * (discount.discountPercent / 100),
        );
        cart.discountOnTotalPrice = {
          discountedAmount: {
            currencyCode: CURRENCY,
            centAmount: discountedAmount,
          },
        };
      }
    } else {
      cart.discountOnTotalPrice = undefined;
    }
  }
}
