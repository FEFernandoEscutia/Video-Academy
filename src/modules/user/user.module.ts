import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailService } from 'src/emails/emails.service';

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
