import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Region } from '../../users/entities/user.entity';

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
}
