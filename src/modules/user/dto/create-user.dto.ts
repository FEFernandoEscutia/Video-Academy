import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The full name of the user.',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The password of the user. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character, and should be between 8 and 15 characters long.',
    example: 'Password@123',
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/,
  )
  password: string;

  @ApiProperty({
    description: 'The phone number of the user, in an international format. The "+" sign will be automatically added by an interceptor',
    example: '1234567890',
  })  
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiPropertyOptional({
    description: 'Role of the user',
    enum: Role,
    default: Role.USER,
    example: Role.USER,
  })
  @IsOptional()
  role?: Role;
}
