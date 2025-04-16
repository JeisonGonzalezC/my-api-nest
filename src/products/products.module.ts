import { Module } from '@nestjs/common';
import { ContentfulService } from './services/contentful.service';
import { SyncService } from 'src/sync/sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ContentfulService, SyncService, ProductService],
  exports: [ContentfulService],
})
export class ProductsModule {}
