import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Movie } from '../movie/entities/movie.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const movie = await this.movieRepository.findOneBy({
      id: createReviewDto.movieId,
    });
    if (!movie) {
      throw new NotFoundException(
        `Movie with ID ${createReviewDto.movieId} not found`,
      );
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      movie,
    });
    const savedReview = await this.reviewRepository.save(review);

    // Update average rating
    const reviews = await this.reviewRepository.find({
      where: { movie: { id: movie.id } },
    });
    movie.averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await this.movieRepository.save(movie);

    return savedReview;
  }

  findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['movie'] });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['movie'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);

    const updatedReview = await this.reviewRepository.save(review);

    // Update average rating if movieId is provided
    if (updateReviewDto.movieId) {
      const movie = await this.movieRepository.findOneBy({
        id: updateReviewDto.movieId,
      });
      if (movie) {
        const reviews = await this.reviewRepository.find({
          where: { movie: { id: movie.id } },
        });
        movie.averageRating =
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await this.movieRepository.save(movie);
      }
    }

    return updatedReview;
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);

    // Update average rating
    const movie = review.movie;
    if (movie) {
      const reviews = await this.reviewRepository.find({
        where: { movie: { id: movie.id } },
      });
      movie.averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : null;
      await this.movieRepository.save(movie);
    }
  }
}
