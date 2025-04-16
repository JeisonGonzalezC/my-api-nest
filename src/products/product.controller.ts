import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { IProductResponse } from './interfaces';
import { ProductFilterDto } from './dto/product-filter.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getProductsByFilter(@Query() args: ProductFilterDto): Promise<IProductResponse> {
    return this.productService.getProducts(args);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
}
