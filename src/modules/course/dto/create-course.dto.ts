import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayNotEmpty,
  IsPositive,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'JavaScript Programming Course',
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Title is required.' })
  @MinLength(5, { message: 'Title must be at least 5 characters long.' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters.' })
  title: string;

  @ApiProperty({
    description: 'Course description',
    example:
      'This course covers the basics of JavaScript, including functions, arrays, and objects.',
    minLength: 20,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  @MinLength(20, {
    message: 'Description must be at least 20 characters long.',
  })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters.' })
  description: string;

  @ApiProperty({
    description: 'Course price',
    example: 49.99,
    minimum: 0,
    maximum: 10000,
  })
  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number.' })
  @Min(0, { message: 'Minimum price is 0.' })
  @Max(10000, { message: 'Maximum price is 10,000.' })
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Thumbnail URL for the course',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsString()
  @IsUrl({}, { message: 'Thumbnail must be a valid URL.' })
  @IsOptional({ message: 'Thumbnail is optional.' })
  thumbnail?: string;

}
