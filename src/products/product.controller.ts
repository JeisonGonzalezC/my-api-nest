import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProductResponse } from './interfaces';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @ApiOkResponse({
    description: 'Get products by filter',
    schema: {
      example: {
        page: 1,
        limit: 10,
        total: 100,
        totalPages: 10,
        count: 10,
        products: [
          {
            id: '1',
            contentfulId: 'contentful-1',
            sku: 'SKU-123',
            name: 'Product 1',
            brand: 'Brand A',
            category: 'Category X',
            price: 100,
            stock: 50,
          },
        ],
      },
    },
  })
  async getProductsByFilter(@Query() args: ProductFilterDto): Promise<IProductResponse> {
    return this.productService.getProducts(args);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Product deleted successfully',
    schema: {
      example: {},
    },
  })
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
