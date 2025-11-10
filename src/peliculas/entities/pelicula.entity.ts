import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'PELICULAS1' }) // 👈 nombre real de la tabla en PostgreSQL
export class Pelicula {
  @PrimaryGeneratedColumn()
  id: number; // 🔑 Clave primaria, autoincremental

  @Column({ type: 'varchar', length: 100, name: 'TITULO' })
  titulo: string; // 🎬 Título de la película

  @Column({ type: 'int', name: 'ANIO' })
  anio: number; // 📅 Año de estreno

  @Column({ type: 'text', nullable: true, name: 'DESCRIPCION' })
  descripcion?: string; // 📝 Descripción opcional

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'IMAGEN_URL' })
  imagen_url?: string; // 🖼️ URL opcional de imagen o carátula

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt?: Date;
}
