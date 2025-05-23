import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Between, FindOperator, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { IProductFilter, IProductResponse } from './interfaces';

const LIMIT_BY_PAGE_PRODUCTS = 5;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getProducts(args: IProductFilter = {}): Promise<IProductResponse> {
    const { page = 1, name, category, minPrice, maxPrice } = args;

    // Validate price range
    let priceCondition: FindOperator<number> | undefined = undefined;
    if (minPrice && maxPrice) {
      priceCondition = Between(minPrice, maxPrice);
    } else if (minPrice) {
      priceCondition = MoreThanOrEqual(minPrice);
    } else if (maxPrice) {
      priceCondition = LessThanOrEqual(maxPrice);
    }

    const where = {
      deleted: false,
      ...(name && { name }),
      ...(category && { category }),
      ...(priceCondition && { price: priceCondition }),
    };

    try {
      const [products, total] = await Promise.all([
        this.productRepository.find({
          where,
          skip: (page - 1) * LIMIT_BY_PAGE_PRODUCTS,
          take: LIMIT_BY_PAGE_PRODUCTS,
        }),

        this.productRepository.count({
          where,
        }),
      ]);

      const items = products.map((product) => {
        return {
          id: product.id,
          contentfulId: product.contentfulId,
          sku: product.sku,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          stock: product.stock,
        };
      });

      return {
        page,
        limit: LIMIT_BY_PAGE_PRODUCTS,
        total,
        totalPages: Math.ceil(total / LIMIT_BY_PAGE_PRODUCTS),
        count: items.length,
        products: items,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch products',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id, deleted: false } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    try {
      await this.productRepository.update(id, { deleted: true });
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to delete product',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
