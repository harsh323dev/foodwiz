import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  create(
    @Body()
    data: {
      restaurantId: string;
      items: Array<{ menuItemId: string; quantity: number }>;
    },
    @Req() req: any,
  ) {
    return this.ordersService.create(req.user.id, req.user.region, data);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  findAll(@Req() req: any) {
    return this.ordersService.findAll(req.user.id);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.findOne(id, req.user.id);
  }

  @Post(':id/checkout')
  @Roles('ADMIN', 'MANAGER')
  checkout(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.checkout(id, req.user.id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.cancel(id, req.user.id);
  }
}
