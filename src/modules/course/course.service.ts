import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, PrismaClient } from '@prisma/client';
import { CourseFilterDto } from './dto/filter-course.dto';
import { UploadApiResponse, v2 } from 'cloudinary';
const toStream = require('buffer-to-stream');
@Injectable()
export class CourseService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Course Service');

  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  async findMyFavCourses(id: string) {
    const dbUser = await this.user.findMany({
      where: { id },
      include: {
        favorites: true,
      },
    });
    const favCourses = dbUser.flatMap((user) => user.favorites);
    if (favCourses.length === 0) {
      throw new NotFoundException('No favorite courses found');
    }
    return favCourses;
  }

  //******************************
  async create(
    techs: string[],
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
  ) {
    const { thumbnail, ...data } = createCourseDto;
    new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          transformation: [{ transformation: 'Regular size' }],
        },
        async (error, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            const newCourse = {
              ...data,
              thumbnail: result.url,
              technologies: techs,
            };

            await this.course.create({ data: newCourse });

            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });

    return { message: 'Course Created Successfully' };
  }
  //******************************
  async findAll(filterDto: CourseFilterDto): Promise<Course[]> {
    const { technologies, priceSelector, isfree } = filterDto;
    const techFilter = technologies
      ? {
          technologies: {
            hasSome: Array.isArray(technologies)
              ? technologies
              : [technologies],
          },
        }
      : {};

    // Filtro por cursos gratuitos o pagos
    const freeFilter = isfree !== undefined ? { isfree } : {};

    const priceFilter = priceSelector;
    if (!priceFilter) {
      return await this.course.findMany({
        where: { ...techFilter, ...freeFilter },
        include: {
          videos: true,
          reviews: true,
        },
      });
    }
    if (priceFilter === 'true') {
      return await this.course.findMany({
        where: {
          ...techFilter,
          ...freeFilter,
        },
        orderBy: {
          price: 'asc',
        },
        include: {
          videos: true,
          reviews: true,
        },
      });
    }
    if (priceFilter === 'false') {
      return await this.course.findMany({
        where: {
          ...techFilter,
          ...freeFilter,
        },
        orderBy: {
          price: 'desc',
        },
        include: {
          videos: true,
          reviews: true,
        },
      });
    }
  }

  async searchCourses(keyword: string) {
    const lowerKeyword = keyword.toLowerCase();

    const keywords = lowerKeyword.split(' ').filter((word) => word.length > 0);

    return this.course.findMany({
      where: {
        OR: keywords.map((word) => ({
          title: {
            contains: word,
            mode: 'insensitive',
          },
        })),
      },
    });
  }

  //******************************
  async findMyCourses(id: string) {
    const dbUser = await this.user.findFirst({
      where: {
        id,
      },
      include: {
        courses: true,
      },
    });
    if (!dbUser) {
      throw new NotFoundException('User Not Found');
    }
    return dbUser.courses;
  }
  //******************************
  async findTopCourses(filterDto: CourseFilterDto) {
    const { sortBy } = filterDto;

    let orderByCondition;

    // Determina la lógica de ordenación según el criterio recibido
    switch (sortBy) {
      case 'users':
        orderByCondition = [{ users: { _count: 'desc' } }];
        break;
      case 'reviews':
        orderByCondition = [{ reviews: { _count: 'desc' } }];
        break;
      case 'rating':
        orderByCondition = [{ rating: 'desc' }];
        break;
      default:
        orderByCondition = [{ users: { _count: 'desc' } }];
        break;
    }

    // Busca los cursos con el criterio de ordenamiento
    const topCourses = await this.course.findMany({
      where: { isAvailable: true },
      include: {
        users: true,
        reviews: true,
      },
      orderBy: orderByCondition,
    });

    // Mapea los resultados para incluir solo la información necesaria
    return topCourses.map((course) => ({
      id: course.id,
      title: course.title,
      userCount: course.users.length,
      thumbnail: course.thumbnail,
      price: course.price,
      averageRating: course.rating,
      reviewCount: course.reviews.length,
    }));
  }

  //************************************* */

  async findCourseAvailable(): Promise<Course[]> {
    return await this.course.findMany({
      where: {
        isAvailable: true,
      },
      include: {
        reviews: true,
      },
    });
  }

  async findCoursePopular(): Promise<Course[]> {
    return await this.course.findMany({ orderBy: {} });
  }

  async findOne(id: string): Promise<CreateCourseDto> {
    return await this.course.findFirst({
      where: {
        id,
      },
      include: {
        videos: true,
      },
    });
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ) {
    const dbCourse = await this.course.findFirst({ where: { id } });
    if (!dbCourse) {
      throw new NotFoundException('Course does not exist');
    }
    const { title, isAvailable, price, description } = updateCourseDto;
    if (!file) {
      await this.course.update({
        where: { id },
        data: {
          title: title !== undefined && title !== '' ? title : dbCourse.title,
          isAvailable: isAvailable,
          price: price !== undefined && price !== null ? price : dbCourse.price,
          description:
            description !== undefined && description !== ''
              ? description
              : dbCourse.description,
        },
      });
      return { message: 'Course has been updated correctly' };
    }

    try {
      new Promise((resolve, reject) => {
        const upload = v2.uploader.upload_stream(
          {
            resource_type: 'auto',
            transformation: [{ transformation: 'Regular size' }],
          },
          async (error, result: UploadApiResponse) => {
            if (error) {
              reject(error);
            } else {
              const updatedCourse = {
                title:
                  title !== undefined && title !== '' ? title : dbCourse.title,
                isAvailable:
                  isAvailable !== null ? isAvailable : dbCourse.isAvailable,
                price:
                  price !== undefined && price !== null
                    ? price
                    : dbCourse.price,
                description:
                  description !== undefined && description !== ''
                    ? description
                    : dbCourse.description,
                thumbnail: result.url,
              };

              await this.course.update({
                where: { id },
                data: { ...updatedCourse },
              });

              resolve(result);
            }
          },
        );
        toStream(file.buffer).pipe(upload);
      });

      return { message: 'Course has been updated correctly.' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload image');
    }
  }

  async remove(id: string): Promise<string> {
    const course = await this.course.findFirst({ where: { id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    await this.course.update({
      where: { id },
      data: { isAvailable: false },
    });

    return `The course with ID ${id} has been successfully deleted.`;
  }

  async addFav(id: string, userId: string, toggle: boolean) {
    const course = await this.course.findFirst({ where: { id } });

    if (!course) {
      throw new NotFoundException('Course not found');
    }
    const dbUser = await this.user.findFirst({
      where: { id: userId },
      include: {
        courses: true,
        favorites: true,
      },
    });
    const isCourseOwnedByUser = dbUser.courses.some(
      (userCourse) => userCourse.id === course.id,
    );
    if (!isCourseOwnedByUser) {
      throw new UnauthorizedException('User has not purchased the course yet');
    }
    const isCourseStaredByUser = dbUser.favorites.some(
      (favCourse) => favCourse.id === course.id,
    );
    if (toggle === true) {
      if (isCourseStaredByUser) {
        throw new UnauthorizedException(
          'You already have this course added to your favorites',
        );
      }
      return await this.user.update({
        where: { id: userId },
        data: {
          favorites: {
            connect: { id: course.id },
          },
        },
      });
    } else {
      if (!isCourseStaredByUser) {
        throw new UnauthorizedException('This course is not in your favorites');
      }
      return await this.user.update({
        where: { id: userId },
        data: {
          favorites: {
            disconnect: { id: course.id },
          },
        },
      });
    }
  }
}
