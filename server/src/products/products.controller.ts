import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FiltersService } from './filters.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filtersService: FiltersService,
  ) {}

  @Get()
  getAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.productsService.getAll(
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Get('search')
  search(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('filter') filter?: string | string[],
    @Query('text.en-US') text?: string,
    @Query('fuzzy') fuzzy?: string,
    @Query('sort') sort?: string,
  ) {
    const filters = filter ? (Array.isArray(filter) ? filter : [filter]) : [];

    return this.filtersService.applyFilters({
      filters,
      text: fuzzy === 'true' && text ? text : undefined,
      sort,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    });
  }

  @Get(':key')
  getByKey(@Param('key') key: string) {
    return this.productsService.getByKey(key);
  }
}
