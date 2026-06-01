import { LOCAL_API_URL } from "../../../project-config";
import type { DataProduct } from "../../../shared";

export async function getProductsBigPrice(): Promise<DataProduct> {
  let products: DataProduct;
  await fetch(
    `${LOCAL_API_URL}/products/search?filter=variants.price.centAmount:range(5000000 to 50000000)`,
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
