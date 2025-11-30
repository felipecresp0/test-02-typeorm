import { User } from '../../users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Item } from './item.entity';

@Entity({ name: 'favorites' })
@Unique(['userId', 'itemId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  itemId: string;

  @ManyToOne(() => User, (user) => user.favorites, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Item, (item) => item.favorites, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' })
  item: Item;
}
