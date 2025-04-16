import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportFilterDto } from './dto/report-filter.dto';
import {
  IReportByCategoryResponse,
  IReportDeletedProductsResponse,
  IReportInRangeResponse,
} from './interfaces';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('deleted-products-percentage')
  async deletedProductsPercentage(): Promise<IReportDeletedProductsResponse> {
    return this.reportService.deletedProductsPercentage();
  }

  @Get('range/:startDate/:endDate')
  async rangeProductsPercentage(@Param() args: ReportFilterDto): Promise<IReportInRangeResponse> {
    return this.reportService.rangeProductsPercentage(args);
  }

  @Get('percentage-not-deleted/category/:category')
  async percentageByCategory(
    @Param('category') category: string,
  ): Promise<IReportByCategoryResponse> {
    return this.reportService.percentageByCategory(category);
  }
}
