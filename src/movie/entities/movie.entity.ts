import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Review } from '../../review/entities/review.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  releaseDate: Date;

  @Column({ type: 'float', nullable: true })
  averageRating: number;

  @OneToMany(() => Review, (review) => review.movie, { cascade: true })
  reviews: Review[];
}
