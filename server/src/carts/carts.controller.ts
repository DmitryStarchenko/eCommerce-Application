import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body: { currency?: string; userId?: string }) {
    return this.cartsService.create(body.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getById(@Param('id') id: string) {
    return this.cartsService.getById(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body()
    body: {
      version: number;
      actions: { action: string; [key: string]: unknown }[];
    },
  ) {
    return this.cartsService.update(id, body.version, body.actions);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    this.cartsService.delete(id);
    return { id, deleted: true };
  }
}
