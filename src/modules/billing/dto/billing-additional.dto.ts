import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsPositive,
  IsArray,
  ValidateNested,
  IsBoolean,
  Min,
  Max,
} from "class-validator";
import { Type } from "class-transformer";
import {
  PaymentMethod,
  PaymentStatus,
  DiscountType,
} from "../entities/billing.entity";

export class CreatePaymentDto {
  @IsDateString()
  paymentDate: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @IsOptional()
  @IsString()
  authorizationCode?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  processedBy?: string;

  @IsNumber()
  invoiceId: number;

  @IsOptional()
  @IsNumber()
  paymentPlanId?: number;
}

export class CreatePaymentPlanDto {
  @IsNumber()
  @IsPositive()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  downPayment?: number;

  @IsNumber()
  @Min(1)
  numberOfPayments: number;

  @IsNumber()
  @IsPositive()
  paymentAmount: number;

  @IsOptional()
  @IsString()
  frequency?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  interestRate?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  invoiceId: number;

  @IsNumber()
  patientId: number;
}

export class CreateInsurancePlanDto {
  @IsString()
  planName: string;

  @IsString()
  insuranceCompany: string;

  @IsOptional()
  @IsString()
  policyNumber?: string;

  @IsOptional()
  @IsString()
  groupNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  coveragePercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  annualMaximum?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  deductible?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  copayAmount?: number;

  @IsDateString()
  effectiveDate: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  coverageDetails?: {
    treatmentCategory: string;
    coveragePercentage: number;
    annualLimit?: number;
    waitingPeriod?: number;
  }[];

  @IsNumber()
  patientId: number;
}

export class CreateInsuranceClaimDto {
  @IsDateString()
  claimDate: string;

  @IsDateString()
  serviceDate: string;

  @IsNumber()
  @IsPositive()
  submittedAmount: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  invoiceId: number;

  @IsNumber()
  insurancePlanId: number;

  @IsNumber()
  patientId: number;
}

// DTO para crear factura desde tratamientos odontológicos
export class CreateInvoiceFromTreatmentDto {
  @IsArray()
  @IsNumber({}, { each: true })
  treatmentIds: number[];

  @IsOptional()
  @IsNumber()
  clinicId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  insurancePlanId?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

class TreatmentItemDto {
  @IsNumber()
  treatmentId: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  customPrice?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  toothNumbers?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}
