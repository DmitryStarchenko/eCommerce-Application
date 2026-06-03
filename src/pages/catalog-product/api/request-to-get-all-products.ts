import { API_URL } from "../../../project-config";
import type { DataProduct } from "../../../shared";

export async function getAllProducts(
  limit: number,
  offset: number,
): Promise<DataProduct> {
  let allProducts: DataProduct;
  await fetch(`${API_URL}/products?limit=${limit}&offset=${offset}`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data: DataProduct) => {
      allProducts = data;
    })
    .catch(() => {});
  return allProducts;
}
