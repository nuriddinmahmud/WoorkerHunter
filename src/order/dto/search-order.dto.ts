import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export enum SortOrder {
  date = 'date',
  totalSum = 'totalSum',
  withDelivery = 'withDelivery',
}

export enum PaymentType {
  CLICK = 'CLICK',
  PAYME = 'PAYME',
  CASH = 'CASH',
}

export enum StatusOrder {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export class QueryOrderDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  gteDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  lteDate?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  totalSum?: Number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  gteTotalSum?: Number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  lteTotalSum?: Number;

  @IsOptional()
  @IsEnum(['true', 'false'])
  @IsNotEmpty()
  withDelivery: string;

  @IsOptional()
  @IsString()
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentType: PaymentType;

  @IsOptional()
  @IsEnum(['true', 'false'])
  @IsNotEmpty()
  paid: string;

  @IsOptional()
  @IsEnum(StatusOrder)
  @IsNotEmpty()
  status: StatusOrder;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';

  @IsOptional()
  @IsEnum(SortOrder)
  sortBy?: SortOrder;
}
