import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { Between, FindOperator, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { IProductFilter, IProductResponse } from '../interfaces';
import { InjectRepository } from '@nestjs/typeorm';

const LIMIT_BY_PAGE_PRODUCTS = 5;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getProducts(args: IProductFilter = {}): Promise<IProductResponse> {
    const { page = 1, name, category, minPrice, maxPrice } = args;

    // Validate page number
    if (page < 1) {
      throw new Error('Page number must be greater than 0');
    }

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

    const total = await this.productRepository.count({
      where,
    });

    const products = await this.productRepository.find({
      where,
      skip: (page - 1) * LIMIT_BY_PAGE_PRODUCTS,
      take: LIMIT_BY_PAGE_PRODUCTS,
    });

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
      products: items,
    };
  }
}
