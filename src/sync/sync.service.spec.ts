import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { ContentfulService } from '../contentful/contentful.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

// Mock to simulate responses from Contentful
const mockContentfulService = {
  getProducts: jest.fn(),
};

// Mock to simulate the Product repository
const mockProductRepository = {
  count: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
};

describe('SyncService', () => {
  let service: SyncService;
  let contentfulService: ContentfulService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: ContentfulService, useValue: mockContentfulService },
        { provide: getRepositoryToken(Product), useValue: mockProductRepository },
        Logger,
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    contentfulService = module.get<ContentfulService>(ContentfulService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync products correctly', async () => {
    const mockProducts = [
      { sys: { id: '1' }, fields: { sku: '001', name: 'Product 1', price: 10 } },
      { sys: { id: '2' }, fields: { sku: '002', name: 'Product 2', price: 20 } },
    ];

    mockContentfulService.getProducts.mockResolvedValue({ items: mockProducts });
    mockProductRepository.count.mockResolvedValue(2);

    await service.handleProductsCron();

    expect(contentfulService.getProducts).toHaveBeenCalledTimes(1);
    expect(contentfulService.getProducts).toHaveBeenCalledWith(2, 20);

    expect(mockProductRepository.save).toHaveBeenCalledTimes(2);
    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });

  it('should update existing products if they already exist', async () => {
    const existingProduct = { id: 1, contentfulId: '1', sku: '001', name: 'Product 1' };
    const mockProducts = [
      { sys: { id: '1' }, fields: { sku: '001', name: 'Updated Product 1', price: 30 } },
    ];

    mockContentfulService.getProducts.mockResolvedValue({ items: mockProducts });
    mockProductRepository.count.mockResolvedValue(1);
    mockProductRepository.findOne.mockResolvedValue(existingProduct);

    await service.handleProductsCron();

    expect(mockProductRepository.update).toHaveBeenCalledWith(existingProduct.id, {
      contentfulId: '1',
      sku: '001',
      name: 'Updated Product 1',
      price: 30,
    });
    expect(mockProductRepository.save).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    mockContentfulService.getProducts.mockRejectedValue(new Error('Contentful error'));

    await service.handleProductsCron();

    expect(mockProductRepository.save).not.toHaveBeenCalled();
    expect(mockProductRepository.update).not.toHaveBeenCalled();
  });
});
