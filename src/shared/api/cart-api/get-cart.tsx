import { API_URL } from "../../../project-config";
import { getTokenFromCookie, saveTokenCookie, TOKEN_NAMES } from "../..";
import type { Cart } from "..";

export async function getCart(): Promise<Cart> {
  let cart: Cart = {
    id: "",
    version: 0,
    lineItems: [],
    totalPrice: { currencyCode: "USD", centAmount: 0 },
    totalLineItemQuantity: 0,
  };
  const BEARER_TOKEN = getTokenFromCookie(TOKEN_NAMES.successUserAccess);
  const cartID = getTokenFromCookie(TOKEN_NAMES.cartID);
  await fetch(`${API_URL}/carts/${cartID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((data: Cart) => {
      saveTokenCookie(data.version.toString(), TOKEN_NAMES.cartVersion);
      cart = data;
    })
    .catch(() => {});
  return cart;
}
