import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('user')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload an image file for an specific User',
    description:
      'USERS can upload an image only for their own profile, ADMINS can upload an image for any user by specifying the user ID.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (jpg, jpeg, png, or webp)',
        },
      },
    },
  })
  async uploadFileUsingId(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|webp|png)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const loggedUser = req.user;

    return this.filesService.uploadFileUsingId(loggedUser.id, file);
  }
  
  @Post('course/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload an image file for an specific User',
    description:
      'USERS can upload an image only for their own profile, ADMINS can upload an image for any user by specifying the user ID.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload (jpg, jpeg, png, or webp)',
        },
      },
    },
  })
  async uploadCourseFileUsingId(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadCourseFileUsingId(id, file);
  }

  @Post('GoogleUpload')
@ApiOperation({
  summary: 'Upload a file to Google Cloud Storage',
  description: 'Uploads a file to Google Cloud Storage and returns its public URL.',
})
@ApiBody({
  description: 'File to be uploaded',
  required: true,
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        description: 'File to upload',
      },
    },
  },
})
@ApiResponse({
  status: 200,
  description: 'File uploaded successfully',
  schema: {
    type: 'object',
    properties: {
      url: { type: 'string', description: 'Public URL of the uploaded file' },
    },
  },
})
@ApiResponse({
  status: 400,
  description: 'Bad Request. File is required or upload failed.',
})
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  try {
    const publicUrl = await this.filesService.uploadGoogleFiles(file);

    return { url: publicUrl };
  } catch (error) {
    throw new BadRequestException('Failed to upload file');
  }
}

  //
}
