import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    MovieModule, // Import the MovieModule
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
