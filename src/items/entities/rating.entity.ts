import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Item } from './item.entity';

@Entity({ name: 'ratings' })
@Unique(['userId', 'itemId'])
export class Rating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  itemId: string;

  @Column('int')
  value: number;

  @ManyToOne(() => User, (user) => user.ratings, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Item, (item) => item.ratings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @CreateDateColumn()
  createdAt: Date;
}
