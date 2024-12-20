import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import preChargedData from '../../helpers/courses.data.json';

@Injectable()
export class SeederService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Seeder Service');
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');

    for (const course of preChargedData) {
      const dbCourse = await this.course.findFirst({
        where: { title: course.title },
      });
      if (dbCourse) {
        continue 
      }
      const savedCourse = await this.course.create({
        data: {
          title: course.title,
          description: course.description,
          technologies: course.technologies,
          price: course.price,
          thumbnail:course.thumbnail,
          isAvailable: course.isAvailable,
        },
      });
      course.videos.map(async(video)=>{
        await this.video.create({data:{
          title:video.title,
          description:video.description,
          url:video.url,
          course:{ connect: { id: savedCourse.id } }
        }})
      })
      this.logger.log(`Course ${course.title} and its videos were created successfully`)
    }
    this.logger.log(`seeder courses updated`)
  }
}
