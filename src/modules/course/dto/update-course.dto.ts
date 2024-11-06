import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @IsString()
  @MaxLength(100, { message: 'Title cannot exceed 100 characters.' })
  title?: string;


  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAvailable?: boolean;
}
