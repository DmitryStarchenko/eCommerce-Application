import { Injectable, NotFoundException } from '@nestjs/common';
import { carsData } from '../data/cars.data';
import { Product } from '../common/types';

@Injectable()
export class ProductsService {
  getAll(limit = 20, offset = 0) {
    const results = carsData.results.slice(offset, offset + limit);
    return {
      limit,
      offset,
      count: results.length,
      total: carsData.total,
      results,
    };
  }

  getByKey(key: string): Product {
    const product = carsData.results.find((p) => p.key === key);
    if (!product) {
      throw new NotFoundException(`Product with key "${key}" not found`);
    }
    return product;
  }

  getById(id: string): Product | undefined {
    return carsData.results.find((p) => p.id === id);
  }

  getAllProducts(): Product[] {
    return carsData.results;
  }
}
