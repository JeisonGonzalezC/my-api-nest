import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { EntryCollection, EntrySkeletonType } from 'contentful';
import { Product } from 'src/products/entities/product.entity';
import { ContentfulService } from 'src/products/services/contentful.service';
import { Repository } from 'typeorm';

const LIMIT_PRODUCTS_API_CONTENTFUL = 20;

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private contentfulService: ContentfulService,

    // Injecting the Product repository to perform database operations
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  @Cron('0 * * * *') // every hour
  async handleProductsCron() {
    this.logger.log('Init contentful...');

    try {
      const countProductsFromDB = await this.productRepository.count();

      const contentfulProducts = await this.contentfulService.getProducts(
        countProductsFromDB,
        LIMIT_PRODUCTS_API_CONTENTFUL,
      );

      await this.saveProductsToDB(contentfulProducts);
    } catch (error) {
      this.logger.error('Error during sync:', error);
    }
  }

  private async saveProductsToDB(items: EntryCollection<EntrySkeletonType, undefined, string>) {
    const products = items.items.map((item) => {
      return {
        contentfulId: item.sys.id,
        sku: item.fields.sku as string,
        name: item.fields.name as string,
        brand: item.fields.brand as string,
        model: item.fields.model as string,
        category: item.fields.category as string,
        color: item.fields.color as string,
        price: item.fields.price as number,
        currency: item.fields.currency as string,
        stock: item.fields.stock as number,
      };
    });

    for (const product of products) {
      try {
        const existingProduct = await this.productRepository.findOne({
          where: { contentfulId: product.contentfulId },
        });

        if (existingProduct) {
          await this.productRepository.update(existingProduct.id, product);
        } else {
          const newProduct = this.productRepository.create(product);
          await this.productRepository.save(newProduct);
        }
      } catch (error) {
        this.logger.error('Error saving product to DB:', error);
      }
    }
  }
}
