import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { createHmac } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  private hashPassword(password: string) {
    return createHmac('sha256', 'pwd-salt').update(password).digest('hex');
  }

  async create(createUserDto: CreateUserDto, allowRole = false) {
    const user = this.usersRepo.create({
      email: createUserDto.email.toLowerCase(),
      passwordHash: this.hashPassword(createUserDto.password),
      displayName: createUserDto.displayName,
      role: allowRole && createUserDto.role ? createUserDto.role : 'ALUMNO',
    });
    return this.usersRepo.save(user);
  }

  findAll() {
    return this.usersRepo.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (updateUserDto.password) {
      user.passwordHash = this.hashPassword(updateUserDto.password);
    }
    Object.assign(user, {
      displayName: updateUserDto.displayName ?? user.displayName,
      role: updateUserDto.role ?? user.role,
    });
    return this.usersRepo.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.usersRepo.remove(user);
    return { deleted: true };
  }
}
