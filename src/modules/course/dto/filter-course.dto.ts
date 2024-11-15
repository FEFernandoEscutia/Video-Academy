import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
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

  @ApiPropertyOptional({
    description: 'Indicates if the course is free (true for free, false for paid)',
    type: Boolean,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isfree?: boolean;

  @ApiPropertyOptional({
    description: 'Sorting criteria for courses',
    enum: ['users', 'reviews', 'rating'],
    example: 'users',
  })
  @IsOptional()
  @IsString()
  sortBy?: 'users' | 'reviews' | 'rating';

}
