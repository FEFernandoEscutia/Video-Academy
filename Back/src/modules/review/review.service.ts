import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ReviewService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Review Service');
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  async create(createReviewDto: CreateReviewDto) {
    const { content, courseId, userId, rating } = createReviewDto;
    return this.review.create({
      data: {
        content,
        courseId,
        userId,
        rating,
      },
    });
  }

  async findAll() {
    return this.review.findMany();
  }

  async findOne(id: string) {
    return this.review.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  async remove(id: string) {
    return this.review.delete({
      where: { id },
    });
  }
}
