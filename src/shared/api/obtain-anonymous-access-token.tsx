import { LOCAL_API_URL } from "../../project-config";
import { createCart, saveTokenCookie, TOKEN_NAMES } from "../";
import type { AccessToken } from ".";

export async function obtainAnonymousAccessToken(): Promise<void> {
  return fetch(`${LOCAL_API_URL}/auth/anonymous/token`, {
    method: "POST",
  })
    .then((response) => response.json())
    .then(async (data: AccessToken) => {
      saveTokenCookie(data.access_token, TOKEN_NAMES.guestAccess);
      saveTokenCookie(data.refresh_token, TOKEN_NAMES.guestRefresh);
      await createCart();
    })
    .catch(() => console.log("Отсутствует доступ к серверу"));
}
