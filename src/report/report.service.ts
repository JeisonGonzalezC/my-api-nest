import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  IReportByCategoryResponse,
  IReportDeletedProductsResponse,
  IReportInRangeResponse,
  IReportRange,
} from './interfaces';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async deletedProductsPercentage(): Promise<IReportDeletedProductsResponse> {
    try {
      const totalProducts = await this.productRepository.count();

      const deletedProducts = await this.productRepository.count({
        where: { deleted: true },
      });

      const percentage = totalProducts > 0 ? (deletedProducts / totalProducts) * 100 : 0;

      return {
        totalProducts,
        deletedProducts,
        percentage: `${percentage.toFixed(2)}%`, // format to 2 decimal places
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error calculating deleted products percentage',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async rangeProductsPercentage(args: IReportRange): Promise<IReportInRangeResponse> {
    const { startDate, endDate } = args;

    try {
      const productsInRange = await this.productRepository.find({
        where: {
          deleted: false,
          createdAt: Between(new Date(startDate), new Date(endDate)),
        },
      });

      const productsWithoutPrice = productsInRange.filter((product) => !product.price).length;

      const percentage =
        productsInRange.length > 0 && productsWithoutPrice > 0
          ? (productsInRange.length / productsWithoutPrice) * 100
          : 0;

      return {
        productsInRange: productsInRange.length,
        productsWithoutPrice,
        percentage: `${percentage.toFixed(2)}%`,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error calculating products percentage in range',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async percentageByCategory(category: string): Promise<IReportByCategoryResponse> {
    const [totalProducts, productsByCategory] = await Promise.all([
      this.productRepository.count(),
      this.productRepository.count({
        where: { category, deleted: false },
      }),
    ]);

    const percentage =
      totalProducts > 0 && productsByCategory > 0 ? (productsByCategory / totalProducts) * 100 : 0;

    return { category, percentage: percentage.toFixed(2) + '%' };
  }
}
