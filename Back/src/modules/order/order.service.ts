import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { envs } from 'src/config';

@Injectable()
export class OrderService extends PrismaClient implements OnModuleInit {
  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger('Order Service');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  async create(createOrderDto: CreateOrderDto) {
    const session = await this.stripe.checkout.sessions.create({
      //Here goes the id of the order
      payment_intent_data: {
        // user info and more details
        metadata: {
          name:"Fernando"
        },
      },
      // products that people are purchasing
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Course 1',
            },
            unit_amount: 2000, // 20usd // 2000/100 = 20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://www.auth.soyhenry.com/',
      cancel_url: 'http://localhost:3000/api/users1',
    });

    return session;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
