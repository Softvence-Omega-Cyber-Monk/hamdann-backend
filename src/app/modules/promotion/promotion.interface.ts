export interface IPromotion {
  promotionImage: string; // Multer will save image URL/path here
  promotionName: string;
  promotionType: "percentage" | "fixed";
  discountValue: number;
  minimumPurchase: number;
  allProducts?: string[];
  specificProducts?: string[];
  ProductsCategories?: string[];
  startDate: Date;
  endDate: Date;
  termsAndConditions?: string;
  isActive?: boolean;
  totalView?: number;
  totalClick?: number;
  redemptionRate?: string;
  conversionRate?: string;
}






