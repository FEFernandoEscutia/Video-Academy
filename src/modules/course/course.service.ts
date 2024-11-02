import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
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
    return topCourses.map(course => ({
        id: course.id,
        title: course.title,
        userCount: course.users.length,
        thumbnail: course.thumbnail,
        price: course.price,
        averageRating: course.rating,
        reviewCount: course.reviews.length
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

  // async filterCourse(filterDto: CourseFilterDto) {
  //   const { technologies, priceMin, priceMax } = filterDto;
  //   const where: any = { isAvailable: true };

  //   if (technologies && technologies.length > 0) {
  //     where.technologies = { hasSome: technologies };
  //   }

  //   if (priceMin !== undefined || priceMax !== undefined) {
  //     where.price = {};
  //     where.price.gte = priceMin; // gte valores mayor o igual
  //     where.price.lte = priceMax; // lte  valores menor o igual
  //   }

  //   try {
  //     return await this.course.findMany({
  //       where,
  //     });
  //   } catch (error) {
  //     console.error('Error al obtener cursos:', error);
  //     throw new Error('No se pudieron obtener los cursos');
  //   }
  // }

  async findOne(id: string): Promise<CreateCourseDto> {
    return await this.course.findFirst({
      where: {
        isAvailable: true,
        id: id,
      },
      include: {
        videos: true,
      },
    });
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<UpdateCourseDto> {
    const courseByID = this.course.findFirst({ where: { id } });

    if (!courseByID) {
      throw new Error('Course not found'); // Manejo de errores si no se encuentra el curso
    }
    return await this.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async remove(id: string): Promise<string> {
    // Busca el curso por su ID
    const course = await this.course.findFirst({ where: { id } });

    // Si el curso no existe, lanza una excepción 404
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Elimina el curso de manera lógica (isAvailable = false)
    await this.course.update({
      where: { id },
      data: { isAvailable: false },
    });

    return `The course with ID ${id} has been successfully deleted.`;
  }
}
