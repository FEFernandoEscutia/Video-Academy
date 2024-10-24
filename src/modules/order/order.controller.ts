import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { Request, Response } from 'express';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  //******************************************************************************************
  @Post()
  @UseGuards(AuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const loggedUser = req.user;
    return this.orderService.createOrder(loggedUser.id, createOrderDto);
  }
  //******************************************************************************************
  @Post('payment')
  @UseGuards(AuthGuard)
  paymentSession(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const loggedUser = req.user;
    return this.orderService.payment(loggedUser.id, createOrderDto);
  }
  //******************************************************************************************
  @Post('webhook')
  async stripeWebhook(@Req() req: Request, res: Response) {
    return this.orderService.stripeWebhook(req, res);
  }
  //******************************************************************************************
  @Get()
  findAll() {
    return this.orderService.findAll();
  }
  //******************************************************************************************
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }
  //******************************************************************************************
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }
  //******************************************************************************************
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
