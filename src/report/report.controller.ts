import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import {
  IReportByCategoryResponse,
  IReportDeletedProductsResponse,
  IReportInRangeResponse,
} from './interfaces';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('deleted-products-percentage')
  @ApiOkResponse({
    description: 'Get the percentage of deleted products',
    schema: {
      example: {
        totalProducts: 100,
        deletedProducts: 10,
        percentage: '10%',
      },
    },
  })
  async deletedProductsPercentage(): Promise<IReportDeletedProductsResponse> {
    return this.reportService.deletedProductsPercentage();
  }

  @Get('range/:startDate/:endDate')
  @ApiOkResponse({
    description: 'Get the percentage of products in a date range',
    schema: {
      example: {
        productsInRange: 50,
        productsWithoutPrice: 5,
        percentage: '10%',
      },
    },
  })
  async rangeProductsPercentage(@Param() args: ReportFilterDto): Promise<IReportInRangeResponse> {
    return this.reportService.rangeProductsPercentage(args);
  }

  @Get('percentage-not-deleted/category/:category')
  @ApiOkResponse({
    description: 'Get the percentage of products by category',
    schema: {
      example: {
        category: 'Electronics',
        percentage: '15%',
      },
    },
  })
  async percentageByCategory(
    @Param('category') category: string,
  ): Promise<IReportByCategoryResponse> {
    return this.reportService.percentageByCategory(category);
  }
}
