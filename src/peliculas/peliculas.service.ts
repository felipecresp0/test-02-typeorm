import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './entities/pelicula.entity';
import { UpdatePeliculaDto } from './dtos/update-peliculas.dto';
import { CreatePeliculaDto } from './dtos/create-pelicula.dto';


@Injectable()
export class PeliculasService {
    constructor(
        @InjectRepository(Pelicula)
        private readonly repo: Repository<Pelicula>,
    ) { }

    findAll() {
        return this.repo.find();
    }

    async create(CreatePeliculaDto: CreatePeliculaDto) {
        const nuevaPelicula = this.repo.create(CreatePeliculaDto);
        return this.repo.save(nuevaPelicula);
    }
}

