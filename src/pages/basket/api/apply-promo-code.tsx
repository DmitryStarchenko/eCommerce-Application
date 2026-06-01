import { LOCAL_API_URL } from "../../../project-config";
import {
  getTokenFromCookie,
  saveTokenCookie,
  TOKEN_NAMES,
  type Cart,
  type Actions,
} from "../../../shared";

export async function applyPromoCode(actions: Actions): Promise<Cart> {
  let cart: Cart = {
    id: "",
    version: 0,
    lineItems: [],
    totalPrice: { currencyCode: "USD", centAmount: 0 },
    totalLineItemQuantity: 0,
  };
  const BEARER_TOKEN = getTokenFromCookie(TOKEN_NAMES.successUserAccess);
  const cartID = getTokenFromCookie(TOKEN_NAMES.cartID);
  const cartVersion = getTokenFromCookie(TOKEN_NAMES.cartVersion);
  const body = {
    version: Number(cartVersion),
    actions: [actions],
  };
  const response = await fetch(`${LOCAL_API_URL}/carts/${cartID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to apply promo code");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: Cart = await response.json();
  saveTokenCookie(data.version.toString(), TOKEN_NAMES.cartVersion);
  cart = data;
  return cart;
}
