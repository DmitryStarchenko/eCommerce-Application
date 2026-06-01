import { LOCAL_API_URL } from "../../../project-config";
import {
  getTokenFromCookie,
  saveTokenCookie,
  TOKEN_NAMES,
} from "../../../shared";
import type { Customer } from "../../../shared";

export async function getUserInfoRequest(): Promise<Customer> {
  let userInfo: Customer = {
    id: "",
    version: 0,
    email: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    addresses: [],
    defaultShippingAddressIds: "",
    defaultbillingAddressIds: "",
  };
  const USER_ID = getTokenFromCookie(TOKEN_NAMES.activeUserID);
  const BEARER_TOKEN = getTokenFromCookie(TOKEN_NAMES.successUserAccess);
  await fetch(`${LOCAL_API_URL}/users/${USER_ID}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((data: Customer) => {
      userInfo = data;
      saveTokenCookie(data.version.toString(), TOKEN_NAMES.userVersion);
    })
    .catch(() => console.log("No connection"));
  return userInfo;
}
