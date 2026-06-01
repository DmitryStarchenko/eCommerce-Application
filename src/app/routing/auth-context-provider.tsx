import { useEffect, useState } from "react";
import {
  AuthUserContext,
  hasLoggedInToken,
  obtainAnonymousAccessToken,
} from "../../shared";
import type { ReactNode } from "react";

const clearCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function AuthUserContextProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [isGuestAccess, setIsGuestAccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthCheckReady, setIsAuthCheckReady] = useState(false);

  const getGuestToken = async (): Promise<void> => {
    if (!hasLoggedInToken()) {
      await obtainAnonymousAccessToken().then(() => setIsGuestAccess(true));
    }
  };

  useEffect(() => {
    void getGuestToken();
    setIsLoggedIn(hasLoggedInToken());
    setIsAuthCheckReady(true);
  }, []);

  function login(): void {
    if (hasLoggedInToken()) {
      setIsLoggedIn(true);
    }
  }

  function logout(): void {
    clearCookie("user_access_token");
    clearCookie("user_refresh_token");
    clearCookie("active_user_ID");
    clearCookie("user_version");
    clearCookie("cart_ID");
    clearCookie("cart_version");
    clearCookie("anonymous_access_token");
    clearCookie("anonymous_refresh_token");
    setIsLoggedIn(false);
    setIsGuestAccess(false);
    void getGuestToken();
  }

  return (
    <AuthUserContext.Provider
      value={{ isGuestAccess, isLoggedIn, isAuthCheckReady, login, logout }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}
