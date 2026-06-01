import { Injectable } from '@nestjs/common';
import { Category } from '../common/types';
import { categoriesData } from '../data/categories.data';

@Injectable()
export class CategoriesService {
  getAll(): Category[] {
    return categoriesData;
  }
}
