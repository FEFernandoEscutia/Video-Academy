import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    description: 'Title of the video',
    example: 'Understanding NestJS Basics',
  })
  title: string;

  @ApiProperty({
    description: 'Description of the video content',
    example:
      'This video explains the core concepts of NestJS, a progressive Node.js framework.',
  })
  description: string;

  @ApiProperty({
    description: 'URL of the video',
    example: 'https://www.example.com/video/understanding-nestjs-basics',
  })
  url: string;

  @ApiProperty({
    description: 'ID of the course associated with the video',
    example: 'course123',
  })
  courseId: string;
}
