import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'UUID of the selected course',
    example: 'e123f5e4-a90b-4b23-bf02-3349f6b4e123',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
