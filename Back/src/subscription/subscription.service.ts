import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export  class SubscriptionService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Subscription Service');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action adds a new subscription';
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
