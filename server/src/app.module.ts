import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    ProductsModule,
    AuthModule,
    CartsModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
