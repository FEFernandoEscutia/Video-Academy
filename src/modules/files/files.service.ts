import { Storage } from '@google-cloud/storage';
import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UploadApiResponse, v2 } from 'cloudinary';
import { envs } from 'src/config';
const toStream = require('buffer-to-stream');
@Injectable()
export class FilesService extends PrismaClient implements OnModuleInit {
  private storage: Storage;
  private bucketName = 'consolelearn-439802-buckt';
  private readonly logger = new Logger('FilesService Service');
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
  async uploadFileUsingId(id: string, file: Express.Multer.File) {
    const dbUser = await this.user.findFirst({ where: { id } });

    if (!dbUser) {
      throw new NotFoundException(`course was not found`);
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          transformation: [{ transformation: 'User-picture' }],
        },
        (error, result: UploadApiResponse) => {
          if (error) {
            reject(error);
          } else {
            this.user
              .update({
                where: { id: dbUser.id },
                data: { image: result.url },
              })
              .then(() => resolve(result))
              .catch(reject);

          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
    
  }

  async uploadGoogleFiles(file: Express.Multer.File) {
    const bucket = this.storage.bucket(this.bucketName);
    const destination = `uploads/${Date.now()}-${file.originalname}`;
    const cloudFile = bucket.file(destination);
    await cloudFile.save(file.buffer, {
      contentType: file.mimetype,
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${cloudFile.bucket.name}/${encodeURIComponent(cloudFile.name)}`
    return { url: publicUrl };
  }
}
