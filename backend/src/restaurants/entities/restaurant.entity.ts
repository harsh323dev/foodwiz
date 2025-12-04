import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Region } from '../../users/entities/user.entity';
import { MenuItem } from '../../menu-items/entities/menu-item.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'enum', enum: Region })
  region: Region;

  @OneToMany(() => MenuItem, menuItem => menuItem.restaurant)
  menuItems: MenuItem[];
}
