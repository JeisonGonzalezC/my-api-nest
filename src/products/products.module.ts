import { Module } from '@nestjs/common';
import { ContentfulService } from './services/contentful.service';
import { SyncService } from 'src/sync/sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ContentfulService, SyncService],
  exports: [ContentfulService],
})
export class ProductsModule {}
