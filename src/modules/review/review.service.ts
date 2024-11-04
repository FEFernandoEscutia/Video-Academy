import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaClient } from '@prisma/client';

import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class ReviewService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Review Service');
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  async create(
    createReviewData: CreateReviewDto & { userId: string; courseId: string },
  ) {
    const { content, courseId, userId, rating } = createReviewData;

    const courseExists = await this.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExists) {
      throw new BadRequestException('Course not found');
    }

    const createdReview = await this.review.create({
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

    return {
      review: createdReview,
      message: `Thank you for sharing your experience! Your feedback on ${createdReview.course.title} helps us improve.`,
    };
  }

  async findAll() {
    const reviews = await this.review.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: true,
      },
    });
    return reviews
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

  async remove(id: string, userId: string, userRole: string) {
    // Buscar la review a eliminar
    const review = await this.review.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    if (userRole !== 'ROLE.ADMIN') {
      if (review.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to delete this review.',
        );
      }
    }

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

  async findAllWithCourseId(id: string) {
    const dbCourse = await this.course.findFirst({
      where: {
        id,
      },
    });

    if (!dbCourse) {
      throw new NotFoundException('Course does not exist');
    }

    return await this.review.findMany({
      where: {
        courseId: dbCourse.id,
      },
      include: {
        course: true,
        user: true,
      },
    });
  }
}
