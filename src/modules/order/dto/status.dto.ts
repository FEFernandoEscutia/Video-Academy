import { ApiProperty } from '@nestjs/swagger';
import {  IsEnum, IsOptional } from 'class-validator';

enum BooleanString {
  TRUE = 'true',
  FALSE = 'false',
}

export class StatusDto {
  @IsOptional()
  @IsEnum(BooleanString, {
    message: 'paid must be either true or false',
  })
  paid?: BooleanString;
}
