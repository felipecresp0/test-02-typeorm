import { Controller, Get } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import { Post, Body } from '@nestjs/common';
import { CreatePeliculaDto } from './dtos/create-pelicula.dto';

@Controller('peliculas')
export class PeliculasController {

    constructor(
        private peliculasService: PeliculasService,
    ) { }   

    @Get()
    findAll() {
        return this.peliculasService.findAll();
    }
    @Post()
    create(@Body() createPeliculaDto: CreatePeliculaDto) {
        return this.peliculasService.create(createPeliculaDto);
    }
}
