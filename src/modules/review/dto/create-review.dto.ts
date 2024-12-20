import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsIn } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Content of the review',
    example: 'This course was very insightful and well-structured.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Rating given by the user, from 1 to 5',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}
