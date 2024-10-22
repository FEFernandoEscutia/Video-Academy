import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiProperty({
    description: 'Content of the review',
    example: 'This course was very insightful and well-structured.',
    required: false,
  })
  content?: string;

  @ApiProperty({
    description: 'ID of the course being reviewed',
    example: 'abc123',
    required: false,
  })
  courseId?: string;

  @ApiProperty({
    description: 'ID of the user who is writing the review',
    example: 'user789',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Rating given by the user, from 1 to 5',
    example: 5,
    minimum: 1,
    maximum: 5,
    required: false,
  })
  rating?: number;
}
