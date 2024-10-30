import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class VideoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Videos Service');

  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  async findByCourseId(courseId: string) {
    const videos = await this.video.findMany({
      where: { courseId },
    });

    if (videos.length === 0) {
      throw new Error('Course not found.');
    }

    return videos;
  }

  async create(createVideoDto: CreateVideoDto) {
    return this.video.create({
      data: createVideoDto,
    });
  }

  async findAll() {
    return this.video.findMany();
  }

  async findOne(id: string) {
    return this.video.findUnique({ where: { id } });
  }

  update(id: string, updateVideoDto: UpdateVideoDto) {
    return this.video.update({
      where: { id },
      data: updateVideoDto,
    });
  }

  remove(id: string) {
    return this.video.delete({
      where: { id },
    });
  }
}
