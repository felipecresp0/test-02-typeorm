import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from './course.entity';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  duration: string;

  @ManyToOne(() => Course, (course) => course.lessons, {
    onDelete: 'CASCADE',
  })
  course: Course;
}