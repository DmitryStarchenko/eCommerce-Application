import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  getById(@Param('id') id: string) {
    return this.usersService.getById(id);
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
    return this.usersService.update(id, body.version, body.actions);
  }
}
