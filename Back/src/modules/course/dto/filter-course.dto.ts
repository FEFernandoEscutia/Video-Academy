import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';
enum BooleanString {
  TRUE = 'true',
  FALSE = 'false',
}

export class CourseFilterDto {
  @IsOptional()
  @IsString({ each: true })
  technologies?: string[];

  @IsOptional()
  @IsEnum(BooleanString, {
    message: 'price must be either true or false',
  })
  priceSelector?: BooleanString;
}