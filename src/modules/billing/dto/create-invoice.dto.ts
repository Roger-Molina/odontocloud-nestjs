import { IsNumber, IsOptional, IsString, IsDateString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceItemDto {
  @ApiProperty({ description: 'Descripción del item' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Cantidad', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', minimum: 0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ description: 'ID del tratamiento asociado' })
  @IsOptional()
  @IsNumber()
  treatmentId?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID de la clínica' })
  @IsNumber()
  clinicId: number;

  @ApiProperty({ description: 'ID del paciente' })
  @IsNumber()
  patientId: number;

  @ApiProperty({ description: 'ID del doctor' })
  @IsNumber()
  doctorId: number;

  @ApiProperty({ description: 'ID del tipo de factura' })
  @IsNumber()
  invoiceTypeId: number;

  @ApiProperty({ description: 'Fecha de la factura' })
  @IsDateString()
  invoiceDate: string;

  @ApiProperty({ description: 'Fecha de vencimiento' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ description: 'Subtotal', minimum: 0 })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiPropertyOptional({ description: 'Porcentaje de impuesto', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Monto de impuesto', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ description: 'Monto de descuento', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiPropertyOptional({ description: 'ID del tipo de descuento' })
  @IsOptional()
  @IsNumber()
  discountTypeId?: number;

  @ApiProperty({ description: 'Monto total', minimum: 0 })
  @IsNumber()
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({ description: 'Notas adicionales' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    type: [CreateInvoiceItemDto],
    description: 'Items de la factura'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items: CreateInvoiceItemDto[];
}

// Mantengo como alias para compatibilidad con el código existente
export { CreateInvoiceItemDto as InvoiceItemDto };
