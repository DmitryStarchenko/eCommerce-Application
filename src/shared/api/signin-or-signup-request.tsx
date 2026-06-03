import { API_URL } from "../../project-config";
import { TOKEN_NAMES, saveTokenCookie } from "../";
import type { BodyLogin, BodySignUp } from "./index";

interface AuthResponse {
  customer: {
    id: string;
    version: number;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    addresses: unknown[];
    defaultShippingAddressIds: string;
    defaultbillingAddressIds: string;
  };
  cart: {
    id: string;
    version: number;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
  };
}

export async function sendingSignInOrSignUpRequest(
  body: BodySignUp | BodyLogin,
  typeRequest: string,
): Promise<string> {
  let errorMessage = "";
  const endpoint = typeRequest === "signup" ? "register" : "login";
  await fetch(`${API_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data: AuthResponse & { message?: string; statusCode?: number }) => {
      if (data.statusCode || data.message) {
        errorMessage = data.message ?? "Unknown error";
      } else {
        saveTokenCookie(data.customer.id, TOKEN_NAMES.activeUserID);
        saveTokenCookie(
          data.customer.version.toString(),
          TOKEN_NAMES.userVersion,
        );
        saveTokenCookie(data.cart.id, TOKEN_NAMES.cartID);
        saveTokenCookie(data.cart.version.toString(), TOKEN_NAMES.cartVersion);
        saveTokenCookie(
          data.tokens.access_token,
          TOKEN_NAMES.successUserAccess,
        );
        saveTokenCookie(
          data.tokens.refresh_token,
          TOKEN_NAMES.successUserRefresh,
        );
      }
    })
    .catch(() => (errorMessage = "No connection"));
  return errorMessage;
}
