import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Product } from '../products/entities/product.entity';

describe('ReportService', () => {
  let service: ReportService;
  let productRepository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  describe('deletedProductsPercentage', () => {
    it('should return percentage correctly', async () => {
      productRepository.count.mockResolvedValueOnce(100).mockResolvedValueOnce(25);

      const result = await service.deletedProductsPercentage();

      expect(result).toEqual({
        totalProducts: 100,
        deletedProducts: 25,
        percentage: '25.00%',
      });
    });

    it('should handle 0 products', async () => {
      productRepository.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await service.deletedProductsPercentage();

      expect(result).toEqual({
        totalProducts: 0,
        deletedProducts: 0,
        percentage: '0.00%',
      });
    });

    it('should throw on error', async () => {
      productRepository.count.mockRejectedValue(new Error('Error'));

      await expect(service.deletedProductsPercentage()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('rangeProductsPercentage', () => {
    const args = { startDate: '2024-01-01', endDate: '2024-12-31' };

    it('should return percentage correctly', async () => {
      productRepository.find.mockResolvedValue([
        { price: 100 } as Partial<Product>,
        { price: 0 } as Partial<Product>,
        { price: undefined } as Partial<Product>,
      ] as Product[]);

      const result = await service.rangeProductsPercentage(args);

      expect(result).toEqual({
        productsInRange: 3,
        productsWithoutPrice: 2,
        percentage: '150.00%',
      });
    });

    it('should handle no products', async () => {
      productRepository.find.mockResolvedValue([]);

      const result = await service.rangeProductsPercentage(args);

      expect(result).toEqual({
        productsInRange: 0,
        productsWithoutPrice: 0,
        percentage: '0.00%',
      });
    });

    it('should throw on error', async () => {
      productRepository.find.mockRejectedValue(new Error('Error'));

      await expect(service.rangeProductsPercentage(args)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('percentageByCategory', () => {
    it('should return percentage correctly', async () => {
      productRepository.count.mockResolvedValueOnce(200).mockResolvedValueOnce(50);

      const result = await service.percentageByCategory('electronics');

      expect(result).toEqual({
        category: 'electronics',
        percentage: '25.00%',
      });
    });

    it('should handle 0 total products', async () => {
      productRepository.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await service.percentageByCategory('toys');

      expect(result).toEqual({
        category: 'toys',
        percentage: '0.00%',
      });
    });
  });
});
