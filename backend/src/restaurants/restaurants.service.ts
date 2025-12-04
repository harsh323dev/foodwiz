import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { Region } from '../users/entities/user.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
  ) {}

  // called from AppModule.onModuleInit
  async seed() {
    const count = await this.restaurantRepo.count();
    if (count > 0) return;

    const data: Partial<Restaurant>[] = [
      { name: 'Mumbai Spice House', address: 'Mumbai, India', region: Region.INDIA },
      { name: 'Delhi Diner', address: 'Delhi, India', region: Region.INDIA },
      { name: 'New York Bites', address: 'New York, USA', region: Region.AMERICA },
      { name: 'San Francisco Grill', address: 'San Francisco, USA', region: Region.AMERICA },
    ];

    await this.restaurantRepo.save(data);
  }

  create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = this.restaurantRepo.create(createRestaurantDto);
    return this.restaurantRepo.save(restaurant);
  }

  findAll() {
    return this.restaurantRepo.find();
  }

  findOne(id: string) {
    return this.restaurantRepo.findOne({ where: { id } });
  }

  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    await this.restaurantRepo.update(id, updateRestaurantDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.restaurantRepo.delete(id);
  }
}
