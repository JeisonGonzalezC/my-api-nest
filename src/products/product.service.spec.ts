import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

const mockProductRepository = () => ({
  find: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useFactory: mockProductRepository },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        {
          id: '1',
          contentfulId: 'c1',
          sku: 'sku1',
          name: 'Product1',
          brand: 'Brand1',
          category: 'Cat1',
          price: 100,
          stock: 5,
        },
      ];

      productRepository.find.mockResolvedValue(mockProducts as any);
      productRepository.count.mockResolvedValue(1);

      const result = await productService.getProducts({ page: 1 });

      expect(result).toEqual({
        page: 1,
        limit: 5,
        total: 1,
        totalPages: 1,
        count: 1,
        products: [
          {
            id: '1',
            contentfulId: 'c1',
            sku: 'sku1',
            name: 'Product1',
            brand: 'Brand1',
            category: 'Cat1',
            price: 100,
            stock: 5,
          },
        ],
      });
    });

    it('should throw InternalServerErrorException when repository fails', async () => {
      productRepository.find.mockRejectedValue(new Error('DB error'));

      await expect(productService.getProducts({ page: 1 })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should soft delete a product', async () => {
      const mockProduct = { id: '1', deleted: false } as Product;

      productRepository.findOne.mockResolvedValue(mockProduct);
      productRepository.update.mockResolvedValue({} as any);

      await productService.deleteProduct('1');

      expect(productRepository.update).toHaveBeenCalledWith('1', { deleted: true });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(productService.deleteProduct('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if update fails', async () => {
      const mockProduct = { id: '1', deleted: false } as Product;

      productRepository.findOne.mockResolvedValue(mockProduct);
      productRepository.update.mockRejectedValue(new Error('DB error'));

      await expect(productService.deleteProduct('1')).rejects.toThrow(InternalServerErrorException);
    });
  });
});
