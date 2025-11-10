import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { PeliculasModule } from './peliculas/peliculas.module';

@Module({
  imports: [DatabaseModule, PeliculasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
