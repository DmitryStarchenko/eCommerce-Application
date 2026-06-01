import { LOCAL_API_URL } from "../../../project-config";
import type { DataProduct } from "../../../shared";

export async function sendingFilterSortingSearchRequest(
  token: string,
  limit: number,
  offset: number,
): Promise<DataProduct> {
  let products: DataProduct;
  await fetch(
    `${LOCAL_API_URL}/products/search?${token}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data: DataProduct) => {
      products = data;
    })
    .catch(() => console.log("No connection"));
  return products;
}
