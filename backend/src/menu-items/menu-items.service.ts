import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepo: Repository<MenuItem>,
  ) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemRepo.create(createMenuItemDto);
    return this.menuItemRepo.save(menuItem);
  }

  findAll() {
    return this.menuItemRepo.find({ relations: ['restaurant'] });
  }

  findOne(id: string) {
    return this.menuItemRepo.findOne({ where: { id }, relations: ['restaurant'] });
  }

  async update(id: string, updateMenuItemDto: UpdateMenuItemDto) {
    await this.menuItemRepo.update(id, updateMenuItemDto);
    return this.findOne(id);
  }

  remove(id: string) {
    return this.menuItemRepo.delete(id);
  }
}
