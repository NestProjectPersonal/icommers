import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AuthModule,
    ProductsModule
  ]
})
export class SeedModule { }
