import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, PrismaClient } from '@prisma/client';

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
