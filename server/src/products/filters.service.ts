import { Injectable } from '@nestjs/common';
import { Product } from '../common/types';
import { categoriesData } from '../data/categories.data';
import { ProductsService } from './products.service';

interface FilterParams {
  filters: string[];
  text?: string;
  sort?: string;
  limit: number;
  offset: number;
}

@Injectable()
export class FiltersService {
  constructor(private readonly productsService: ProductsService) {}

  applyFilters(params: FilterParams) {
    let results = this.productsService.getAllProducts();

    for (const filter of params.filters) {
      results = this.applySingleFilter(results, filter);
    }

    if (params.text) {
      results = this.applyTextSearch(results, params.text);
    }

    if (params.sort) {
      results = this.applySort(results, params.sort);
    }

    const limited = results.slice(params.offset, params.offset + params.limit);

    return {
      limit: params.limit,
      offset: params.offset,
      count: limited.length,
      total: results.length,
      results: limited,
    };
  }

  private applySingleFilter(products: Product[], filter: string): Product[] {
    // Support OR logic: split by || and match if ANY sub-filter passes
    const subFilters = filter.split('||');
    if (subFilters.length > 1) {
      return products.filter((p) =>
        subFilters.some((sub) => this.matchSingleFilter(p, sub)),
      );
    }

    // Single filter: match all products that pass
    return products.filter((p) => this.matchSingleFilter(p, filter));
  }

  private matchSingleFilter(product: Product, filter: string): boolean {
    // Parse filter patterns:
    // 1. range: variants.price.centAmount:range(0 to 5000000)
    // 2. exact: variants.attributes.Fuel:"diesel"
    // 3. exact with id: categories.id:"cat-id"
    const rangeMatch = filter.match(/^(.+?):range\((.+?) to (.+?)\)$/);
    if (rangeMatch) {
      const [, path, minStr, maxStr] = rangeMatch;
      const min = Number(minStr);
      const max = Number(maxStr);

      if (path === 'variants.price.centAmount') {
        const centAmount =
          product.masterData.current.masterVariant.prices[0]?.value.centAmount;
        return centAmount >= min && centAmount <= max;
      }

      const attrName = path.replace('variants.attributes.', '');
      const attr = product.masterData.current.masterVariant.attributes.find(
        (a) => a.name === attrName,
      );
      if (!attr) return false;
      const value = Number(attr.value);
      return value >= min && value <= max;
    }

    const exactMatch = filter.match(/^(.+?):"(.+?)"$/);
    if (exactMatch) {
      const [, path, value] = exactMatch;

      if (path === 'categories.id') {
        const category = categoriesData.find((c) => c.id === value);
        if (!category) return false;
        return category.productKeys.includes(product.key);
      }

      const attrName = path.replace('variants.attributes.', '');
      const attr = product.masterData.current.masterVariant.attributes.find(
        (a) => a.name === attrName,
      );
      return String(attr?.value) === String(value);
    }

    return true;
  }

  private applyTextSearch(products: Product[], text: string): Product[] {
    const lowerText = text.toLowerCase();
    return products.filter((p) => {
      const name = p.masterData.current.name['en-US'].toLowerCase();
      const desc = p.masterData.current.description['en-US'].toLowerCase();
      return name.includes(lowerText) || desc.includes(lowerText);
    });
  }

  private applySort(products: Product[], sort: string): Product[] {
    const [field, direction] = sort.split(' ');
    const asc = direction !== 'desc';

    const sorted = [...products].sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (field === 'price') {
        valA =
          a.masterData.current.masterVariant.prices[0]?.value.centAmount ?? 0;
        valB =
          b.masterData.current.masterVariant.prices[0]?.value.centAmount ?? 0;
      } else if (field === 'name.en-US') {
        valA = a.masterData.current.name['en-US'];
        valB = b.masterData.current.name['en-US'];
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return asc ? valA - valB : valB - valA;
      }
      return asc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });

    return sorted;
  }
}
