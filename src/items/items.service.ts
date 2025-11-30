import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CommentDto } from './dto/comment.dto';
import { RatingDto } from './dto/rating.dto';
import { Item } from './entities/item.entity';
import { Favorite } from './entities/favorite.entity';
import { Rating } from './entities/rating.entity';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';

interface QueryFilters {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price' | 'createdAt';
  order?: 'ASC' | 'DESC';
}

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item) private readonly itemsRepo: Repository<Item>,
    @InjectRepository(Favorite) private readonly favoritesRepo: Repository<Favorite>,
    @InjectRepository(Rating) private readonly ratingsRepo: Repository<Rating>,
    @InjectRepository(Comment) private readonly commentsRepo: Repository<Comment>,
  ) {}

  async findAll(filters: QueryFilters = {}) {
    const page = Math.max(filters.page ?? 1, 1);
    const limit = Math.min(filters.limit ?? 10, 50);
    const qb = this.itemsRepo.createQueryBuilder('item');

    if (filters.q) {
      qb.andWhere('item.title ILIKE :q', { q: `%${filters.q}%` });
    }
    if (filters.category) {
      qb.andWhere('item.category = :category', { category: filters.category });
    }
    if (filters.minPrice !== undefined) {
      qb.andWhere('item.price >= :minPrice', { minPrice: filters.minPrice });
    }
    if (filters.maxPrice !== undefined) {
      qb.andWhere('item.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    const sortField = filters.sort ?? 'createdAt';
    qb.orderBy(`item.${sortField}`, filters.order ?? 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: string) {
    const item = await this.itemsRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async create(owner: User, dto: CreateItemDto) {
    if (!['ADMIN', 'PROFESOR'].includes(owner.role)) {
      throw new ForbiddenException('Only professors or admins can create items');
    }

    const entity = this.itemsRepo.create({ ...dto, owner });
    return this.itemsRepo.save(entity);
  }

  async update(id: string, owner: User, dto: UpdateItemDto) {
    const item = await this.findOne(id);
    if (owner.role !== 'ADMIN' && item.owner.id !== owner.id) {
      throw new ForbiddenException('You can only update your own items');
    }
    Object.assign(item, dto);
    return this.itemsRepo.save(item);
  }

  async remove(id: string, owner: User) {
    const item = await this.findOne(id);
    if (owner.role !== 'ADMIN' && item.owner.id !== owner.id) {
      throw new ForbiddenException('You can only delete your own items');
    }
    await this.itemsRepo.remove(item);
    return { deleted: true };
  }

  async toggleFavorite(user: User, itemId: string, shouldAdd: boolean) {
    const item = await this.findOne(itemId);
    const existing = await this.favoritesRepo.findOne({ where: { userId: user.id, itemId } });

    if (shouldAdd) {
      if (existing) return existing;
      const favorite = this.favoritesRepo.create({ user, item, userId: user.id, itemId });
      return this.favoritesRepo.save(favorite);
    }

    if (existing) {
      await this.favoritesRepo.remove(existing);
    }
    return { removed: true };
  }

  async listFavorites(userId: string) {
    return this.favoritesRepo.find({ where: { userId } });
  }

  async upsertRating(user: User, itemId: string, dto: RatingDto) {
    const item = await this.findOne(itemId);
    let rating = await this.ratingsRepo.findOne({ where: { userId: user.id, itemId } });
    if (rating) {
      rating.value = dto.value;
    } else {
      rating = this.ratingsRepo.create({ user, item, userId: user.id, itemId, value: dto.value });
    }
    const saved = await this.ratingsRepo.save(rating);
    await this.recalculateAverage(item.id);
    return saved;
  }

  async deleteRating(user: User, itemId: string, ratingId: string) {
    const rating = await this.ratingsRepo.findOne({ where: { id: ratingId, itemId } });
    if (!rating) {
      throw new NotFoundException('Rating not found');
    }
    if (user.role !== 'ADMIN' && rating.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own rating');
    }
    await this.ratingsRepo.remove(rating);
    await this.recalculateAverage(itemId);
    return { deleted: true };
  }

  async listRatings(itemId: string) {
    return this.ratingsRepo.find({ where: { itemId } });
  }

  async addComment(user: User, itemId: string, dto: CommentDto) {
    const item = await this.findOne(itemId);
    const comment = this.commentsRepo.create({
      user,
      item,
      userId: user.id,
      itemId,
      content: dto.content,
    });
    return this.commentsRepo.save(comment);
  }

  async updateComment(user: User, itemId: string, commentId: string, dto: CommentDto) {
    const comment = await this.commentsRepo.findOne({ where: { id: commentId, itemId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (user.role !== 'ADMIN' && comment.userId !== user.id) {
      throw new ForbiddenException('You can only edit your own comments');
    }
    comment.content = dto.content;
    return this.commentsRepo.save(comment);
  }

  async deleteComment(user: User, itemId: string, commentId: string) {
    const comment = await this.commentsRepo.findOne({ where: { id: commentId, itemId } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (user.role !== 'ADMIN' && comment.userId !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentsRepo.remove(comment);
    return { deleted: true };
  }

  async listComments(itemId: string) {
    return this.commentsRepo.find({ where: { itemId }, order: { createdAt: 'DESC' } });
  }

  private async recalculateAverage(itemId: string) {
    const ratings = await this.ratingsRepo.find({ where: { itemId } });
    const avg = ratings.length
      ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
      : 0;
    await this.itemsRepo.update({ id: itemId }, { averageRating: avg });
  }
}
