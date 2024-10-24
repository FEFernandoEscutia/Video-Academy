import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: "The role assigned to the user. This is optional and can be one of the predefined roles in the system.",
        example: "USER",
      })
      @IsOptional()
      role?: Role;
}
