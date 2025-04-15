import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ContentfulService } from 'src/products/services/contentful.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private contentfulService: ContentfulService) {}

  @Cron('0 * * * *') // every hour
  async handleProductsCron() {
    this.logger.log('Init contentful...');

    try {
      const products = await this.contentfulService.getProducts();
      this.logger.log('Sync success:', products, products.items.length, 'products synced');
    } catch (error) {
      this.logger.error('Error during sync:', error);
    }
  }
}
