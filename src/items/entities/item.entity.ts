import { User } from '../../users/entities/user.entity';
import { Comment } from './comment.entity';
import { Favorite } from './favorite.entity';
import { Rating } from './rating.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  videoKey?: string;

  @Column()
  thumbnailKey: string;

  @Column('float', { default: 0 })
  averageRating: number;

  @ManyToOne(() => User, (user) => user.items, { eager: true })
  owner: User;

  @OneToMany(() => Favorite, (favorite) => favorite.item)
  favorites: Favorite[];

  @OneToMany(() => Rating, (rating) => rating.item)
  ratings: Rating[];

  @OneToMany(() => Comment, (comment) => comment.item)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
