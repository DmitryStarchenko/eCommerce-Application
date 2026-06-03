import { API_URL } from "../../../project-config";
import type { DataProduct } from "../../../shared";

export async function getProductsBigPrice(): Promise<DataProduct> {
  let products: DataProduct;
  await fetch(
    `${API_URL}/products/search?filter=variants.price.centAmount:range(5000000 to 50000000)`,
    {
      method: "GET",
    },
  )
    .then((response) => response.json())
    .then((data: DataProduct) => {
      products = data;
    })
    .catch(() => {});
  return products;
}
