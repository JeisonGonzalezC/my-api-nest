export interface IReportRange {
  startDate: string;
  endDate: string;
}

export interface IReportDeletedProductsResponse {
  totalProducts: number;
  deletedProducts: number;
  percentage: string;
}

export interface IReportInRangeResponse {
  productsInRange: number;
  productsWithoutPrice: number;
  percentage: string;
}

export interface IReportByCategoryResponse {
  category: string;
  percentage: string;
}
