import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem, OrderStatus } from './entities/order.entity';
import { MenuItem } from '../menu-items/entities/menu-item.entity';
import { Region } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
  ) {}

  async create(
    userId: string,
    region: Region,
    data: {
      restaurantId: string;
      items: Array<{ menuItemId: string; quantity: number }>;
    },
  ) {
    let total = 0;
    const orderItems: OrderItem[] = [];

    for (const item of data.items) {
      const menuItem = await this.menuItemRepo.findOne({
        where: { id: item.menuItemId },
      });
      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }

      const itemTotal = Number(menuItem.price) * item.quantity;
      total += itemTotal;

      const orderItem = this.orderItemRepo.create({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });

      orderItems.push(orderItem);
    }

    const order = this.orderRepo.create({
      userId,
      region,
      restaurantId: data.restaurantId,
      total,
      status: OrderStatus.PENDING,
      items: orderItems,
    });

    return this.orderRepo.save(order);
  }

  findAll(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'restaurant'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: string, userId: string) {
    return this.orderRepo.findOne({
      where: { id, userId },
      relations: ['items', 'restaurant'],
    });
  }

  async checkout(id: string, userId: string) {
    const order = await this.findOne(id, userId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PENDING) {
      throw new Error('Order already placed or cancelled');
    }

    order.status = OrderStatus.PLACED;
    return this.orderRepo.save(order);
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id, userId);
    if (!order) throw new NotFoundException('Order not found');

    order.status = OrderStatus.CANCELLED;
    return this.orderRepo.save(order);
  }
}
