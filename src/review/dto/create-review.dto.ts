import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1, description: 'The ID of the movie' })
  movieId: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the reviewer',
    required: false,
  })
  reviewerName?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(10)
  @ApiProperty({ example: 8, description: 'The rating of the movie (0-10)' })
  rating: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Great movie!',
    description: 'The comments about the movie',
  })
  reviewComments: string;
}
