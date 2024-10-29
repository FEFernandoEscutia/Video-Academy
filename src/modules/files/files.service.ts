import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UploadApiResponse, v2 } from 'cloudinary';
const toStream = require('buffer-to-stream');
@Injectable()
export class FilesService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('FilesService Service');
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

            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
