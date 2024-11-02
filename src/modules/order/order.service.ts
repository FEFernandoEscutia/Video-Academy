import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient, Role } from '@prisma/client';
import Stripe from 'stripe';
import { envs } from 'src/config';
import { Request, Response } from 'express';
import { UUID } from 'crypto';
import { StatusDto } from './dto/status.dto';

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

    return {
      message: 'Proceeding with your payment',
      data: await this.order.create({
        data: {
          user: { connect: { id: dbUser.id } },
          status: false,
          course: { connect: { id: dbCourse.id } },
        },
        include: {
          course: true,
        },
      }),
    };
  }
  //***********************************************************************************

  async payment(userId: string, orderId: string) {
    const dbUser = await this.user.findFirst({ where: { id: userId } });
    const dbOrder = await this.order.findFirst({
      where: { id: orderId, status: false },
      include: { course: true },
    });
    if (!dbOrder) {
      throw new BadRequestException(
        'Order was not found, or has been paid already',
      );
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
          name: dbUser.name,
          userId: dbUser.id,
          email: dbUser.email,
          phone: dbUser.phone,
          orderId: dbOrder.id,
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
      success_url: `https://conso-learn.vercel.app/course/${dbCourse.id}`,
      cancel_url: 'https://conso-learn.vercel.app/profile',
    });

    return session;
  }
  //*********************************************************************************************
  async stripeWebhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];
    let event: Stripe.Event;
    const endpointsecret = 'whsec_AbO6GabDdpCtJoc9TRoXvrlkiOqWlu7N';
    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        signature,
        endpointsecret,
      );
    } catch (err) {
      console.log(err);
      return;
    }

    switch (event.type) {
      case 'charge.succeeded':
        const succeeded = event.data.object;
        const [dbOrder, dbCourse] = await Promise.all([
          this.order.findFirst({
            where: { id: succeeded.metadata.orderId },
            include: { course: true },
          }),
          this.course.findFirst({ where: { id: succeeded.metadata.courseId } }),
        ]);
        await this.order.update({
          where: {
            id: dbOrder.id,
          },
          data: {
            status: true,
            updatedAt: new Date(),
            details: {
              create: {
                quantity: 1,
                price: dbOrder.course.price,
                ticket: event.data.object.receipt_url,
              },
            },
          },
        });
        await this.user.update({
          where: { id: succeeded.metadata.userId },
          data: { courses: { connect: { id: dbCourse.id } } },
        });
        break;
      default:
        break;
    }

    return;
  }
  //*********************************************************************************************
  async findAll(loggedUserId: UUID) {
    const dbUser = await this.user.findFirst({
      where: {
        id: loggedUserId,
      },
    });
    if (!dbUser) {
      throw new BadRequestException('user does not exist');
    }
    if (dbUser.role === Role.USER)
      return this.order.findMany({
        where: { userId: dbUser.id },
        include: {
          details: true,
          course: true,
        },
      });

    return await this.order.findMany({
      include: { details: true, course: true },
    });
  }
  //*********************************************************************************************
  async adminFindAll(statusDto: StatusDto) {
    const { paid } = statusDto;

    if (!paid) {
      return await this.order.findMany({
        include: {
          user: true,
        },
      });
    }
    if (paid === 'true') {
      return await this.order.findMany({
        where: {
          status: true,
        },
        include: {
          user: true,
        },
      });
    }
    if (paid === 'false') {
      return await this.order.findMany({
        where: {
          status: false,
        },
        include: {
          user: true,
        },
      });
    }
  }
  //*********************************************************************************************
  async findOne(id: string) {
    const dbOrder = await this.order.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (!dbOrder) {
      throw new BadRequestException('Order not found');
    }
    return dbOrder;
  }
  //*****************************************************************
  async deletePendingOrder(id: string, loggedUserId: string) {
    const dbOrder = await this.order.findUnique({
      where: { id },
    });
    if (dbOrder.userId !== loggedUserId) {
      throw new ForbiddenException(
        `You are not authorized to cancel this order`,
      );
    }
    if (dbOrder.status) {
      throw new BadRequestException(
        `Order with ID ${id} has already been completed`,
      );
    }
    await this.order.delete({ where: { id } });
    return { message: `Order has been cancelled correctly` };
  }
}
