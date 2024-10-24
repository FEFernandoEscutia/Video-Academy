import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { envs } from 'src/config';
import { Request, Response } from 'express';

@Injectable()
export class OrderService extends PrismaClient implements OnModuleInit {
  private readonly stripe = new Stripe(envs.stripeSecret);
  private readonly logger = new Logger('Order Service');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  //***********************************************************************************
  async createOrder(id: string, createOrderDto: CreateOrderDto) {
    const dbCourse = await this.course.findFirst({
      where: { id: createOrderDto.id, isAvailable: true },
    });
    const dbUser = await this.user.findFirst({
      where: { id },
      include: {
        courses: true,
        orders: true,
      },
    });
    if (!dbCourse) {
      throw new BadRequestException(
        'The course does not exist or is unavailable',
      );
    }
    for (const course of dbUser.courses) {
      if (course.id === dbCourse.id) {
        throw new BadRequestException(
          'You already have this course or there is a pending order',
        );
      }
    }
    for (const order of dbUser.orders) {
      if (order.courseId === dbCourse.id) {
        throw new BadRequestException(
          'You already have this course or there is a pending order',
        );
      }
    }

    return await this.order.create({
      data: {
        user: { connect: { id: dbUser.id } },
        status: false,
        course: { connect: { id: dbCourse.id } },
      },
      include: {
        course: true,
      },
    });
  }
  //***********************************************************************************

  async payment(userId: string, createOrderDto: CreateOrderDto) {
    const dbUser = await this.user.findFirst({ where: { id: userId } });
    const dbOrder = await this.order.findFirst({
      where: { id: createOrderDto.id },
      include: { course: true },
    });
    if (!dbOrder) {
      throw new BadRequestException('Order was not found');
    }
    const dbCourse = await this.course.findFirst({
      where: { id: dbOrder.courseId },
    });

    const session = await this.stripe.checkout.sessions.create({
      //Here goes the id of the order
      payment_method_types: ['card'],
      payment_intent_data: {
        // user info and more details
        metadata: {
          name: dbUser.id,
          email: dbUser.email,
          phone: dbUser.phone,
          courseId: dbCourse.id,
        },
      },
      // products that people are purchasing
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: dbCourse.title,
              description: dbCourse.description,
            },
            unit_amount: dbCourse.price * 100, // 20usd // 2000/100 = 20.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/api/users1`,
      cancel_url: 'http://localhost:3000/api/users1',
    });

    return session;
  }
 //*********************************************************************************************
  async stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];
    let event: Stripe.Event;
    const endpointsecret = ""
    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        endpointsecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    console.log({ event });
    switch (event.type) {
      case 'charge.succeeded':
        console.log(event);
        break;
      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(200).send({ signature });
  }
 //*********************************************************************************************
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
