import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Lesson } from './entities/lesson.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Express } from 'express';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,
    @InjectRepository(Lesson)
    private readonly lessonRepo: Repository<Lesson>,
  ) {}

  /**
   * Mapea la entidad Course a la forma que espera el frontend:
   * - author: { name, avatarUrl }
   * - mantiene lessons tal cual (id, title, duration)
   */
  private mapCourseForClient(course: Course) {
    const { authorName, authorAvatarUrl, ...rest } = course as any;

    return {
      ...rest,
      author:
        authorName || authorAvatarUrl
          ? {
              name: authorName ?? '',
              avatarUrl: authorAvatarUrl ?? '',
            }
          : undefined,
    };
  }

  async findAll() {
    const courses = await this.courseRepo.find();
    return courses.map((c) => this.mapCourseForClient(c));
  }

  async findOne(id: string) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.mapCourseForClient(course);
  }

  /**
   * Crea un curso a partir de:
   * - dto: CreateCourseDto (title, category, price, description, lessons, authorName, authorAvatarUrl)
   * - file: imagen subida (opcional)
   */
  async create(dto: CreateCourseDto, file?: Express.Multer.File) {
    const { title, category, price, description, lessons, authorName, authorAvatarUrl } = dto;

    // lessons viene como string JSON desde el body (form-data)
    const parsedLessons: { title: string; duration: string }[] = JSON.parse(lessons);

    // Si tenemos file, usamos su filename; si no, imagen dummy
    const imageUrl = file
      ? `/uploads/${file.filename}` // más adelante podrás mover esto a S3/Cloudinary
      : 'https://placehold.co/600x400/png?text=Course';

    const course = this.courseRepo.create({
      title,
      category,
      price: parseFloat(price),
      description,
      imageUrl,
      authorName,
      authorAvatarUrl,
      // rating y reviews usan los valores por defecto de la entidad
    });

    // Creamos las lessons asociadas al curso
    course.lessons = parsedLessons.map((l) =>
      this.lessonRepo.create({
        title: l.title,
        duration: l.duration,
      }),
    );

    const saved = await this.courseRepo.save(course);
    return this.mapCourseForClient(saved);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    Object.assign(course, updateCourseDto);

    const saved = await this.courseRepo.save(course);
    return this.mapCourseForClient(saved);
  }

  async remove(id: string) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    await this.courseRepo.remove(course);
    return { deleted: true };
  }
}