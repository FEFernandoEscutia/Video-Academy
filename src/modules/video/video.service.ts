import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { PrismaClient } from '@prisma/client';
import { Storage } from '@google-cloud/storage';
import { envs } from 'src/config';

@Injectable()
export class VideoService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('Videos Service');
  private storage: Storage;
  private bucketName = 'consolelearn-439802-buckt';
  constructor() {
    super();
    this.storage = new Storage({
      credentials: {
        client_email: envs.googleCloudClientEmail,
        private_key: envs.googleCloudPrivateKey,
      },
      projectId: envs.googleCloudProjectId,
    });
  }

  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }
  async create(
    createVideoDto: CreateVideoDto,
    file: Express.Multer.File,
    id: string,
  ) {
    const dbCourse = await this.course.findFirst({ where: { id } });
    if (!dbCourse) {
      throw new NotFoundException('Course does not exist');
    }
    const { ...data } = createVideoDto;
    const bucket = this.storage.bucket(this.bucketName);
    const destination = `uploads/${Date.now()}-${file.originalname}`;
    const cloudFile = bucket.file(destination);
    try {
      await cloudFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
      });
    } catch (error) {
      console.log(error);
    }
    const publicUrl = `https://storage.googleapis.com/${cloudFile.bucket.name}/${encodeURIComponent(cloudFile.name)}`;
    await this.video.create({
      data: {
        ...data,
        url: publicUrl,
        courseId: dbCourse.id,
      },
    });
    return { message: 'Video created and added successfully' };
  }

  async update(
    id: string,
    updateVideoDto: UpdateVideoDto,
    file?: Express.Multer.File,
  ) {
    const { ...videoData } = updateVideoDto;
    const dbVideo = await this.video.findFirst({ where: { id } });
    if (!dbVideo) {
      throw new NotFoundException('video does not exist');
    }
    if (!file) {
      await this.video.update({ where: { id }, data: videoData });
      return { message: 'Video info updated correctly' };
    }

    const bucket = this.storage.bucket(this.bucketName);
    const destination = `uploads/${Date.now()}-${file.originalname}`;
    const cloudFile = bucket.file(destination);
    try {
      await cloudFile.save(file.buffer, {
        contentType: file.mimetype,
        resumable: false,
      });
    } catch (error) {
      console.log(error);
    }
    const publicUrl = `https://storage.googleapis.com/${cloudFile.bucket.name}/${encodeURIComponent(cloudFile.name)}`;
      await this.video.update({
      where: {
        id: dbVideo.id,
      },
      data: {
        ...videoData,
        url: publicUrl,
      },
    });
    return { message: 'Video created and added successfully' };
  }

  async findOne(id: string) {
    return await this.video.findMany({ where: { courseId: id } });
  }

  async remove(id: string) {
    const dbVideo = await this.video.findFirst({
      where: {
        id,
      },
    });
    if (!dbVideo) {
      throw new BadRequestException('video does not exist');
    }
    await this.video.delete({
      where: { id },
    });
    return { message: 'Video deleted correctly' };
  }
}
