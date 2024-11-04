import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { EmailService } from 'src/emails/emails.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, EmailService],
})
export class OrderModule {}
