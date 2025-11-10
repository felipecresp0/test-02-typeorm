import { Module } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { PeliculasController } from './peliculas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pelicula } from './entities/pelicula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pelicula])],
  providers: [PeliculasService],
  controllers: [PeliculasController]
})
export class PeliculasModule {}
