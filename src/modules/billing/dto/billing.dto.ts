import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  Min,
  Max,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateInvoiceItemDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNumber()
  @IsOptional()
  treatmentId?: number;

  @IsArray()
  @IsOptional()
  toothNumbers?: string[];
}

export class CreateInvoiceDto {
  @IsString()
  invoiceNumber?: string;

  @IsDateString()
  invoiceDate: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  patientId: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsNumber()
  clinicId: number;

  @IsNumber()
  @IsOptional()
  appointmentId?: number;

  @IsNumber()
  invoiceTypeId: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  discountTypeId?: number;

  @IsNumber()
  @Min(0)
  totalAmount: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  paymentTerms?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @IsOptional()
  items?: CreateInvoiceItemDto[];
}

export class UpdateInvoiceDto {
  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsDateString()
  @IsOptional()
  invoiceDate?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsNumber()
  @IsOptional()
  patientId?: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsNumber()
  @IsOptional()
  clinicId?: number;

  @IsNumber()
  @IsOptional()
  appointmentId?: number;

  @IsNumber()
  @IsOptional()
  invoiceTypeId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  subtotal?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  taxAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  discountAmount?: number;

  @IsNumber()
  @IsOptional()
  discountTypeId?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  @IsOptional()
  paymentTerms?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  @IsOptional()
  items?: CreateInvoiceItemDto[];
}

export class CreatePaymentDto {
  @IsNumber()
  invoiceId: number;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  paymentMethodId: number;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  authorizationCode?: string;
}

export class UpdatePaymentDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  paymentMethodId?: number;

  @IsDateString()
  @IsOptional()
  paymentDate?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  authorizationCode?: string;
}

export enum ExpenseCategory {
  MEDICAL_SUPPLIES = "medical_supplies",
  EQUIPMENT = "equipment",
  UTILITIES = "utilities",
  RENT = "rent",
  SALARIES = "salaries",
  MARKETING = "marketing",
  MAINTENANCE = "maintenance",
  INSURANCE = "insurance",
  TAXES = "taxes",
  OTHER = "other",
}

export enum ExpenseStatus {
  PENDING = "pending",
  APPROVED = "approved",
  PAID = "paid",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export class CreateExpenseDto {
  @IsString()
  expenseNumber?: string;

  @IsDateString()
  expenseDate: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsEnum(ExpenseStatus)
  @IsOptional()
  status?: ExpenseStatus;

  @IsString()
  @IsOptional()
  supplierName?: string;

  @IsString()
  @IsOptional()
  invoiceReference?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurringFrequency?: string;

  @IsDateString()
  @IsOptional()
  nextOccurrence?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsDateString()
  @IsOptional()
  approvedAt?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;

  @IsNumber()
  clinicId: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;
}

export class UpdateExpenseDto {
  @IsString()
  @IsOptional()
  expenseNumber?: string;

  @IsDateString()
  @IsOptional()
  expenseDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @IsEnum(ExpenseStatus)
  @IsOptional()
  status?: ExpenseStatus;

  @IsString()
  @IsOptional()
  supplierName?: string;

  @IsString()
  @IsOptional()
  invoiceReference?: string;

  @IsString()
  @IsOptional()
  receiptUrl?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurringFrequency?: string;

  @IsDateString()
  @IsOptional()
  nextOccurrence?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsDateString()
  @IsOptional()
  approvedAt?: string;

  @IsDateString()
  @IsOptional()
  paidAt?: string;

  @IsNumber()
  @IsOptional()
  clinicId?: number;

  @IsNumber()
  @IsOptional()
  doctorId?: number;
}
