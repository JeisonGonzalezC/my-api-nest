import { Controller, Get, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { IProductResponse } from '../interfaces';
import { ProductFilterDto } from '../dto/product-filter.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async getProductsByFilter(@Query() args: ProductFilterDto): Promise<IProductResponse> {
    return this.productService.getProducts(args);
  }
}
