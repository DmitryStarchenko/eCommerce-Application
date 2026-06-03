import { API_URL } from "../../../project-config";
import {
  type Cart,
  createCart,
  getTokenFromCookie,
  TOKEN_NAMES,
} from "../../../shared";

export async function deleteCart(): Promise<Cart> {
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
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then(async () => {
      cart = await createCart();
    });
  return cart;
}
