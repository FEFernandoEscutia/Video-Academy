import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  name?: string 

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string 


}
