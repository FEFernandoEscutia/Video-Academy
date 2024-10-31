import { PartialType } from '@nestjs/swagger';
import { CreateVideoDto } from './create-video.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
  @ApiProperty({
    description: 'Title of the video',
    example: 'Understanding NestJS Basics',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'Description of the video content',
    example:
      'This video explains the core concepts of NestJS, a progressive Node.js framework.',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL of the video',
    example: 'https://www.example.com/video/understanding-nestjs-basics',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: 'ID of the course associated with the video',
    example: 'course123',
    required: false,
  })
  courseId?: string;
}
