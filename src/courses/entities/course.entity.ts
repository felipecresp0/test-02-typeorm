import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string; // el front espera string

  @Column()
  title: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('float', { default: 0 })
  rating: number;

  @Column('int', { default: 0 })
  reviews: number;

  @Column()
  imageUrl: string;

  @Column('text')
  description: string;

  @OneToMany(() => Lesson, (lesson) => lesson.course, {
    cascade: true,
    eager: true,
  })
  lessons: Lesson[];

  @Column({ nullable: true })
  authorName?: string;

  @Column({ nullable: true })
  authorAvatarUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}