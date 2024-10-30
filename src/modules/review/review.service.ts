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
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.review.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.review.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return this.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    return this.review.delete({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  async findTopReviews() {
    const reviews = await this.review.findMany({
      orderBy: {
        rating: 'desc',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const uniqueReviews = [];
    const courseIds = new Set();

    for (const review of reviews) {
      if (!courseIds.has(review.courseId)) {
        uniqueReviews.push({
          ...review,
          user: { ...review.user, username: review.user.name, name: undefined },
        });
        courseIds.add(review.courseId);
      }

      if (uniqueReviews.length >= 6) {
        break;
      }
    }

    this.logger.log('uniqueReviews', uniqueReviews);
    return uniqueReviews;
  }
}
