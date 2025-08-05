import { IsString, IsNumber, IsOptional, IsDateString, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsDateString()
  expenseDate: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  @Type(() => Number)
  clinicId: number;

  @IsNumber()
  @Type(() => Number)
  expenseCategoryId: number;

  @IsNumber()
  @Type(() => Number)
  expenseStatusId: number;
}
