import {
    IsString,
    IsBoolean,
    IsNumber,
    IsArray,
    ValidateNested,
    IsOptional,
    IsEnum,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty } from '@nestjs/swagger';
  // import { PaymentType, OrderStatus, TimeUnit } from '@prisma/client';
  import { PaymentType, OrderStatus, TimeUnit } from './create-order.dto';
  
  // export class UpdateOrderProductDto {
  //   @IsOptional()
  //   @IsString()
  //   @ApiProperty({ description: 'Profession ID (UUID)', required: false })
  //   professionId?: string;
  
  //   @IsOptional()
  //   @IsString()
  //   @ApiProperty({ description: 'Tool ID (UUID)', required: false })
  //   toolId?: string;
  
  //   @IsOptional()
  //   @IsString()
  //   @ApiProperty({ description: 'Level ID (UUID)', required: false })
  //   levelId?: string;
  
  //   @IsOptional()
  //   @IsNumber()
  //   @ApiProperty({ description: 'Quantity', example: 1, required: false })
  //   quantity?: number;
  
  //   @IsOptional()
  //   @IsEnum(TimeUnit)
  //   @ApiProperty({ enum: TimeUnit, description: 'Time unit (HOURLY or DAILY)', required: false })
  //   timeUnit?: TimeUnit;
  
  //   @IsOptional()
  //   @IsNumber()
  //   @ApiProperty({ description: 'Working time (in hours/days)', example: 8, required: false })
  //   workingTime?: number;

  //   @IsOptional()
  //   @IsNumber()
  //   @ApiProperty({ description: 'Price', example: 100.0, required: false })
  //   price?: number;
  // }
  
  export class UpdateOrderDto {
    // @IsOptional()
    // @IsString()
    // @ApiProperty({ description: 'Delivery address', example: '123 Main St', required: false })
    // address?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({ description: 'Latitude', example: '40.7128', required: false })
    // latitude?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({ description: 'Longitude', example: '-74.0060', required: false })
    // longitude?: string;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({ description: 'Date of order', example: '2023-10-15T10:00:00Z', required: false })
    // date?: string;

    // @IsOptional()
    // @IsNumber()
    // @ApiProperty({ description: 'Total Price', example: 100.0, required: false })
    // totalPrice?: number;
  
    // @IsOptional()
    // @IsEnum(PaymentType)
    // @ApiProperty({ example: 'CASH', enum: PaymentType, description: 'Payment type (CASH, CLICK, PAYME)', required: false })
    // paymentType?: PaymentType;
  
    @IsOptional()
    @IsEnum(OrderStatus)
    @ApiProperty({ example: 'COMPLETED', enum: OrderStatus, description: 'Order status', required: false })
    status?: OrderStatus;
  
    // @IsOptional()
    // @IsBoolean()
    // @ApiProperty({ description: 'With delivery', example: true, required: false })
    // withDelivery?: boolean;
  
    // @IsOptional()
    // @IsString()
    // @ApiProperty({ description: 'Delivery comment', example: 'Leave at the door', required: false })
    // deliveryComment?: string;
  
    // @IsOptional()
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => UpdateOrderProductDto)
    // @ApiProperty({
    //   type: [UpdateOrderProductDto],
    //   required: false,
    //   description: 'List of updated order products',
    // })
    // orderProducts?: UpdateOrderProductDto[];
  
    @IsOptional()
    @IsArray()
    @ApiProperty({
      type: [String],
      required: false,
      description: 'List of master IDs for assigning masters (ADMIN only)',
    })
    masterIds?: string[];
  }