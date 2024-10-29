import {
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
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('user:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Upload an image file for an specific User',
    description:"USERS can upload an image only for their own profile, ADMINS can upload an image for any user by specifying the user ID."
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
    @Param('id') id: string,
    @Req() req: any,
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
    const loggedUser = req.user;

    if (loggedUser.roles === Role.USER) {
      this.filesService.uploadFileUsingId(loggedUser.id, file);
    }
    if (loggedUser.roles === Role.ADMIN) {
      console.log(loggedUser);
      this.filesService.uploadFileUsingId(id, file);
    }
  }
}
