import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatusDto } from './dto/status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  //******************************************************************************************
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new order',
    description: `Allows creating a new order for a selected course. Requires authentication.`,
  })
  createOrder(@Query() createOrderDto: CreateOrderDto, @Req() req: any) {
    const loggedUser = req.user;
    return this.orderService.createOrder(loggedUser.id, createOrderDto);
  }
  //******************************************************************************************
  @Post('start-payment/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a Stripe payment session',
    description: `Starts a Stripe payment session for an unpaid order, including user and course details.`,
  })
  @UseGuards(AuthGuard)
  paymentSession(@Param('id') orderId: string, @Req() req: any) {
    if (!orderId) {
      throw new BadRequestException('Please add an order to pay');
    }
    const loggedUser = req.user;
    return this.orderService.payment(loggedUser.id, orderId);
  }
  //******************************************************************************************
  @Post('webhook')
  @ApiOperation({
    summary: 'Stripe Webhook (Internal)',
    description: `Endpoint used by Stripe to send event notifications and complete the purchase process. Not for user access.`,
  })
  async stripeWebhook(@Req() req: Request, res: Response) {
    return this.orderService.stripeWebhook(req, res);
  }
  //******************************************************************************************
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user or all orders',
    description: `Retrieves the logged-in user's orders. Admins can retrieve all orders, while regular users only see their own.`,
  })
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  findAll(@Req() req: any, @Query() statusDto: StatusDto) {
    const loggedUser = req.user;
    if(loggedUser.roles === Role.ADMIN){
      return this.orderService.adminFindAll( statusDto);
    }

    return this.orderService.findAll(loggedUser.id);
  }

  //******************************************************************************************
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get order by ID',
    description: `Retrieve the details of a specific order by its ID. Only accessible to admins.`,
  })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }
  //***************************************************************************************** */
  @Delete()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel Pending Order',
    description: `Endpoint is used to cancel an order that is still pending. it allows  to cancel orders that have not been completed.`,
  })
  @UseGuards(AuthGuard)
  async deletePendingOrder(@Param('id') id: string) {
    return this.orderService.deletePendingOrder(id);
  }
}
