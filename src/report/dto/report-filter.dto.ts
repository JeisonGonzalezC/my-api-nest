import { IsDateString, IsNotEmpty } from 'class-validator';

export class ReportFilterDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
