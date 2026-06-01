import { LOCAL_API_URL } from "../../../project-config";
import type { MasterData } from "../../../shared";

export async function getProduct(
  productKey: string,
): Promise<MasterData | undefined> {
  let product: MasterData | undefined;
  await fetch(`${LOCAL_API_URL}/products/${productKey}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data: MasterData) => {
      product = data;
    })
    .catch(() => console.log("No connection"));
  return product;
}
