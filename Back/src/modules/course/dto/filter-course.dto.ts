import { Transform } from 'class-transformer';
import { IsOptional, IsString,IsArray, IsNumber } from 'class-validator';

export class CourseFilterDto {
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    technologies?: string[];
  
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    priceMin?: number;
  
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    priceMax?: number;

  
}
