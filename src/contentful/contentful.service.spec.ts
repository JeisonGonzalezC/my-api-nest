import { Test, TestingModule } from '@nestjs/testing';
import { ContentfulService } from './contentful.service';
import { InternalServerErrorException } from '@nestjs/common';
import { createClient } from 'contentful';

// Mock the contentful client
jest.mock('contentful', () => ({
  createClient: jest.fn(),
}));

describe('ContentfulService', () => {
  let contentfulService: ContentfulService;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = {
      getEntries: jest.fn(),
    };

    (createClient as jest.Mock).mockReturnValue(mockClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentfulService],
    }).compile();

    contentfulService = module.get<ContentfulService>(ContentfulService);

    process.env.CONTENTFUL_CONTENT_TYPE = 'product';
  });

  describe('getProducts', () => {
    it('should return products from Contentful', async () => {
      const mockResponse = { items: [{ id: '1' }, { id: '2' }] };

      mockClient.getEntries.mockResolvedValue(mockResponse);

      const result = await contentfulService.getProducts(0, 10);

      expect(mockClient.getEntries).toHaveBeenCalledWith({
        content_type: 'product',
        limit: 10,
        skip: 0,
        order: ['sys.createdAt'],
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockClient.getEntries.mockRejectedValue(new Error('Contentful error'));

      await expect(contentfulService.getProducts(0, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw InternalServerErrorException with non-Error object', async () => {
      mockClient.getEntries.mockRejectedValue('Some string error');

      await expect(contentfulService.getProducts(0, 10)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
