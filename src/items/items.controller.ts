import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RatingDto } from './dto/rating.dto';
import { CommentDto } from './dto/comment.dto';

@Controller('items')
@UseGuards(RolesGuard)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.itemsService.findAll({
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      q: query.q,
      category: query.category,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      sort: query.sort,
      order: query.order,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'PROFESOR')
  create(@Req() req: any, @Body() dto: CreateItemDto) {
    return this.itemsService.create(req.user, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, req.user, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    return this.itemsService.remove(id, req.user);
  }

  @Get(':id/ratings')
  listRatings(@Param('id') id: string) {
    return this.itemsService.listRatings(id);
  }

  @Post(':id/ratings')
  @UseGuards(JwtAuthGuard)
  @Roles('ALUMNO', 'PROFESOR', 'ADMIN')
  upsertRating(@Param('id') id: string, @Req() req: any, @Body() dto: RatingDto) {
    return this.itemsService.upsertRating(req.user, id, dto);
  }

  @Delete(':itemId/ratings/:ratingId')
  @UseGuards(JwtAuthGuard)
  deleteRating(
    @Param('itemId') itemId: string,
    @Param('ratingId') ratingId: string,
    @Req() req: any,
  ) {
    return this.itemsService.deleteRating(req.user, itemId, ratingId);
  }

  @Get(':id/comments')
  listComments(@Param('id') id: string) {
    return this.itemsService.listComments(id);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  addComment(@Param('id') id: string, @Req() req: any, @Body() dto: CommentDto) {
    return this.itemsService.addComment(req.user, id, dto);
  }

  @Patch(':itemId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Param('itemId') itemId: string,
    @Param('commentId') commentId: string,
    @Req() req: any,
    @Body() dto: CommentDto,
  ) {
    return this.itemsService.updateComment(req.user, itemId, commentId, dto);
  }

  @Delete(':itemId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('itemId') itemId: string,
    @Param('commentId') commentId: string,
    @Req() req: any,
  ) {
    return this.itemsService.deleteComment(req.user, itemId, commentId);
  }

  @Get('/user/:id/favorites')
  @UseGuards(JwtAuthGuard)
  listFavorites(@Param('id') id: string, @Req() req: any) {
    if (req.user.id !== id && req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Forbidden');
    }
    return this.itemsService.listFavorites(id);
  }

  @Post(':id/favorite')
  @UseGuards(JwtAuthGuard)
  addFavorite(@Param('id') itemId: string, @Req() req: any) {
    return this.itemsService.toggleFavorite(req.user, itemId, true);
  }

  @Delete(':id/favorite')
  @UseGuards(JwtAuthGuard)
  removeFavorite(@Param('id') itemId: string, @Req() req: any) {
    return this.itemsService.toggleFavorite(req.user, itemId, false);
  }
}
