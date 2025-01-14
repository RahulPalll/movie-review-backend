import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Inception',
    description: 'The name of the movie',
  })
  name: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    example: '2010-07-16',
    description: 'The release date of the movie (YYYY-MM-DD)',
  })
  releaseDate: Date;

  @IsOptional()
  @ApiProperty({
    example: 8.5,
    description: 'The average rating of the movie (optional)',
    required: false,
  })
  averageRating?: number;
}
