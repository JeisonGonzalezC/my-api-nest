import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('ReportController', () => {
  let controller: ReportController;
  let service: ReportService;

  const mockReportService = {
    deletedProductsPercentage: jest.fn(),
    rangeProductsPercentage: jest.fn(),
    percentageByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [{ provide: ReportService, useValue: mockReportService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReportController>(ReportController);
    service = module.get<ReportService>(ReportService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('deletedProductsPercentage', () => {
    it('should call service and return data', async () => {
      const mockResponse = { totalProducts: 100, deletedProducts: 20, percentage: '20.00%' };
      mockReportService.deletedProductsPercentage.mockResolvedValue(mockResponse);

      const result = await controller.deletedProductsPercentage();

      expect(service.deletedProductsPercentage).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('rangeProductsPercentage', () => {
    it('should call service with params and return data', async () => {
      const mockResponse = { productsInRange: 10, productsWithoutPrice: 2, percentage: '20.00%' };
      const args = { startDate: '2024-01-01', endDate: '2024-12-31' };

      mockReportService.rangeProductsPercentage.mockResolvedValue(mockResponse);

      const result = await controller.rangeProductsPercentage(args);

      expect(service.rangeProductsPercentage).toHaveBeenCalledWith(args);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('percentageByCategory', () => {
    it('should call service with category and return data', async () => {
      const mockResponse = { category: 'electronics', percentage: '25.00%' };

      mockReportService.percentageByCategory.mockResolvedValue(mockResponse);

      const result = await controller.percentageByCategory('electronics');

      expect(service.percentageByCategory).toHaveBeenCalledWith('electronics');
      expect(result).toEqual(mockResponse);
    });
  });
});
