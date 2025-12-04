import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, Role, Region } from './users/entities/user.entity';

const seedUsers = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('✅ Connected to database');

  const userRepository = dataSource.getRepository(User);

  // Clear existing users
  await userRepository.clear();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    { name: 'Nick Fury', email: 'fury@shield.com', password: hashedPassword, role: Role.ADMIN, region: Region.INDIA },
    { name: 'Captain Marvel', email: 'marvel@shield.com', password: hashedPassword, role: Role.MANAGER, region: Region.INDIA },
    { name: 'Captain America', email: 'america@shield.com', password: hashedPassword, role: Role.MANAGER, region: Region.AMERICA },
    { name: 'Thanos', email: 'thanos@shield.com', password: hashedPassword, role: Role.MEMBER, region: Region.INDIA },
    { name: 'Thor', email: 'thor@shield.com', password: hashedPassword, role: Role.MEMBER, region: Region.INDIA },
    { name: 'Travis', email: 'travis@shield.com', password: hashedPassword, role: Role.MEMBER, region: Region.AMERICA },
  ];

  await userRepository.save(users);
  console.log('✅ Seeded 6 users successfully');
  await dataSource.destroy();
};

seedUsers().catch((err) => console.error('Seed failed:', err));
