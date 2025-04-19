import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ContentfulModule } from '../contentful/contentful.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), ContentfulModule],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
