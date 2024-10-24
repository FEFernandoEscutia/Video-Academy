import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

enum BooleanString {
  TRUE = 'true',
  FALSE = 'false',
}

export class CourseFilterDto {
  @ApiPropertyOptional({
    description: 'List of technologies to filter by',
    example: ['JavaScript', 'Python'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({
    description: 'Filter courses based on whether they have a price or not',
    example: 'true',
    enum: BooleanString,
  })
  @IsOptional()
  @IsEnum(BooleanString, {
    message: 'price must be either true or false',
  })
  priceSelector?: BooleanString;
}
