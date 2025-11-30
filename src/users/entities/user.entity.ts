import { Comment } from '../../items/entities/comment.entity';
import { Favorite } from '../../items/entities/favorite.entity';
import { Item } from '../../items/entities/item.entity';
import { Rating } from '../../items/entities/rating.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { UserRole } from '../../common/decorators/roles.decorator';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', length: 20, default: 'ALUMNO' })
  role: UserRole;

  @Column()
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Item, (item) => item.owner)
  items: Item[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
