import { TOKEN_NAMES } from "./token-names";

export function getTokenFromCookie(tokenName: string): string {
  const arrayCookies = document.cookie.split("; ");

  // Сначала точный поиск запрошенного токена
  for (const cookie of arrayCookies) {
    const [name, value] = cookie.split("=");
    if (name === tokenName) {
      return value;
    }
  }

  // Fallback: если искали user_access_token, но его нет — используем anonymous
  if (tokenName === TOKEN_NAMES.successUserAccess) {
    for (const cookie of arrayCookies) {
      const [name, value] = cookie.split("=");
      if (name === TOKEN_NAMES.guestAccess) {
        return value;
      }
    }
  }

  return "";
}
