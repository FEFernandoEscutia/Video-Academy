import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'The email address associated with the user account',
    example: 'user@example.com',
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account. Must be at least 8 characters long and contain a combination of uppercase, lowercase letters, numbers, and special characters.',
    example: 'SecurePassword123!',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
