import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({
    description: 'Title of the video',
    example: 'Understanding NestJS Basics',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description of the video content',
    example:
      'This video explains the core concepts of NestJS, a progressive Node.js framework.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  
}
