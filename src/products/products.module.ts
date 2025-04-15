import { Module } from '@nestjs/common';
import { ContentfulService } from './services/contentful.service';

@Module({
  providers: [ContentfulService],
  exports: [ContentfulService],
})
export class ProductsModule {}
