import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './dto/createReviewDto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}
