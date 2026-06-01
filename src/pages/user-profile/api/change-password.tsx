import { LOCAL_API_URL } from "../../../project-config";
import {
  getTokenFromCookie,
  saveTokenCookie,
  TOKEN_NAMES,
} from "../../../shared";

// Сервер меняет пароль и возвращает обновлённого customer (без пароля).
// Токен остаётся валидным, дополнительный OAuth запрос не нужен.

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  let message: string;
  const USER_VERSION = getTokenFromCookie(TOKEN_NAMES.userVersion);
  const USER_ID = getTokenFromCookie(TOKEN_NAMES.activeUserID);
  const BEARER_TOKEN = getTokenFromCookie(TOKEN_NAMES.successUserAccess);
  const body = {
    id: USER_ID,
    version: Number(USER_VERSION),
    currentPassword: currentPassword,
    newPassword: newPassword,
  };
  await fetch(`${LOCAL_API_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data: { id: string; version: number; message?: string }) => {
      if (data.id) {
        message = "Password successfully changed";
        saveTokenCookie(data.version.toString(), TOKEN_NAMES.userVersion);
      } else {
        message = data.message ?? "Unknown error";
      }
    })
    .catch((error: Error) => {
      message = error.message;
      console.log("No connection");
    });
  return message;
}
