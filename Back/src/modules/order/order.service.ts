import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Course, PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { envs } from 'src/config';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class OrderService extends PrismaClient implements OnModuleInit {
  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger('Order Service');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  async create(id: string, createOrderDto: CreateOrderDto) {
    const dbCourse = await this.course.findFirst({
      where: { id: createOrderDto.id, isAvailable: true },
    });
    const dbUser = await this.user.findFirst({ where: { id } });
    const { name, email, phone } = dbUser;

    if (!dbCourse) {
      throw new BadRequestException(
        'Course does not exist or its not available',
      );
    }
    try {
      const session = await this.payment({ name, email, phone }, dbCourse);
      console.log(session.status);
      
      if (session && session.payment_status === 'paid') {
        return { message: 'Payment successful and order created!', session };
      }
    } catch (error) {
      throw new BadRequestException('Payment failed, please try again.');
    }
  }

  async payment(user: UpdateUserDto, course: Course) {
    const session = await this.stripe.checkout.sessions.create({
      //Here goes the id of the order
      payment_intent_data: {
        // user info and more details
        metadata: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
      // products that people are purchasing
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
            },
            unit_amount: course.price * 100, // 20usd // 2000/100 = 20.00
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
