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

  /* async findAll() {
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
  } */

  async findAll() {
    const reviews = await this.review.findMany({
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
    return reviews.reverse();
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
      include:{
        course:true,
        user:true
      }
    });
  }
}
