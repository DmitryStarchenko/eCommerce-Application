import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, FiltersService],
  exports: [ProductsService],
})
export class ProductsModule {}
