import {
    IsString,
    IsBoolean,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
    IsEnum,
    IsNotEmpty,
    Min,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  // import { PaymentType, OrderStatus, TimeUnit } from '@prisma/client';

  export enum PaymentType {
    CASH='CASH',
    CLICK='CLICK',
    PAYME='PAYME',
  }
  
  export enum OrderStatus {
    PENDING='PENDING',
    ACCEPTED='ACCEPTED',
    IN_PROGRESS='IN_PROGRESS',
    COMPLETED='COMPLETED',
    CANCELLED='CANCELLED',
    REJECTED='REJECTED',
  }
  
  export enum TimeUnit {
    HOURLY='HOURLY',
    DAILY='DAILY',
  }
  
  
  export class CreateOrderProductDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'uuid', description: 'Profession ID (UUID)', required: false })
    professionId?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'uuid', description: 'Tool ID (UUID)', required: false })
    toolId?: string;
  
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'uuid', description: 'Level ID (UUID)', required: false })
    levelId?: string;
  
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: 'Quantity', example: 1 })
    quantity: number;
  
    @IsOptional()
    @IsEnum(TimeUnit)
    @ApiProperty({ enum: TimeUnit, description: 'Time unit (HOURLY or DAILY)' })
    timeUnit?: TimeUnit;
  
    @IsOptional()
    @IsNumber()
    @Min(1)
    @ApiProperty({ description: 'Working time (in hours/days)', example: 8 })
    workingTime?: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Price', example: 100.0 })
    price: number;
  }
  
  export class CreateOrderDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Delivery address', example: '123 Main St' })
    address: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Latitude', example: '40.7128' })
    latitude: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Longitude', example: '-74.0060' })
    longitude: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Date of order', example: '2023-10-15T10:00:00Z' })
    date: string;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ description: 'Total Price', example: 100.0 })
    totalPrice: number;

    @IsNotEmpty()
    @IsEnum(PaymentType)
    @ApiProperty({ example: 'CASH', enum: PaymentType, description: 'Payment type (CASH, CLICK, PAYME)' })
    paymentType: PaymentType;
  
    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ description: 'With delivery', example: true })
    withDelivery: boolean;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ description: 'Delivery comment', example: 'Leave at the door' })
    deliveryComment: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProductDto)
    @ApiProperty({
      type: [CreateOrderProductDto],
      description: 'List of order products',
      example: [
        {
          "professionId": "d1a48805-2ed4-4387-8a59-c8d8582535f0",
          "levelId": "cf02d2b4-428f-4cce-903b-bd07668052a5",
          "quantity": 2,
          "timeUnit": "HOURLY",
          "workingTime": 8,
          "price": 500
        },
        {
          "toolId": "13252aaf-3d57-49e4-8611-e44333d2dff5",
          "quantity": 10,
          "price": 700
        }
      ]
    })
    orderProducts: CreateOrderProductDto[];
  }