import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  @MaxLength(100, { message: 'Title cannot exceed 100 characters.' })
  title?: string;

  @ApiPropertyOptional({
    description: 'Indicates if the course is available',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value
  )
  isAvailable?: boolean;
}
