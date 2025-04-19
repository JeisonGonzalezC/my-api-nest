import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductFilterDto } from './dto/product-filter.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    getProducts: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should call service to get products', async () => {
    const mockResponse = { page: 1, limit: 5, total: 0, totalPages: 0, count: 0, products: [] };
    mockProductService.getProducts.mockResolvedValue(mockResponse);

    const filters: ProductFilterDto = { name: 'Product' };
    const result = await productController.getProductsByFilter(filters);

    expect(productService.getProducts).toHaveBeenCalledWith(filters);
    expect(result).toEqual(mockResponse);
  });

  it('should call service to delete product', async () => {
    mockProductService.deleteProduct.mockResolvedValue(undefined);

    await productController.deleteProduct('1');

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
  });
});
