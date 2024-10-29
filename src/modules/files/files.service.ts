import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  uploadFileUsingId(id: string, file: Express.Multer.File) {
    throw new Error('Method not implemented.');
  }
}
