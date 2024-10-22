import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, PrismaClient } from '@prisma/client';
import { CourseFilterDto } from './dto/filter-course.dto';


@Injectable()
export  class CourseService extends PrismaClient implements OnModuleInit{
 
 

  private readonly logger = new Logger('Course Service');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  async create(createCourseDto: CreateCourseDto):Promise<CreateCourseDto>{
    return await this.course.create({ data: createCourseDto });
  }

  async findAll():Promise<Course[]> {
    return await this.course.findMany({
      include:{
        reviews:true
      }
    });
  }
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


  async findCoursePopular():Promise<Course[]> {
     
    return await this.course.findMany({ orderBy:{
      
    }})
    
  }

  async filterCourse(filterDto: CourseFilterDto) {
    const { technologies, priceMin, priceMax, dateFrom, dateTo } = filterDto;
    const where: any = { isAvailable: true };

    
    // Filtro por tecnologías
    if (technologies && technologies.length > 0) {
      where.technologies = { hasSome: technologies };
    }
  
    // Filtro por rango de precios
    if (priceMin !== undefined || priceMax !== undefined) {
      where.price = {};
      if (priceMin !== undefined) {
        where.price.gte = priceMin; // Mayor o igual que priceMin
      }
      if (priceMax !== undefined) {
        where.price.lte = priceMax; // Menor o igual que priceMax
      }
    }

  
  try {
    return await this.course.findMany({
      where,
      orderBy: {
        createdAt: 'asc', // Puedes cambiar a 'desc' si deseas el más reciente primero
      },
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    throw new Error('No se pudieron obtener los cursos');
  }
}
  


  async findOne(id: string):Promise<CreateCourseDto> {
    return await this.course.findFirst({
      where: {
        id:id
      }
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto):Promise<UpdateCourseDto> {

    const courseByID =  this.course.findFirst({ where: {id} })

    if (!courseByID) {
      throw new Error('Course not found'); // Manejo de errores si no se encuentra el curso
    }
    return await this.course.update({
      where: {id},
      data : updateCourseDto
      });
  }

  async remove(id: string):Promise<String> {
    const  courseId = this.course.findFirst({ where: {id}})
  
    if (!courseId) {
      throw new Error('Course not found'); // Manejo de errores si no se encuentra el curso
    }
  
    // Elimina el curso
    await this.course.delete({
      where: { id },
    });
  
    return `El curso con ID ${id} ha sido eliminado exitosamente.`;
};


}
