import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
  Req,
  //UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';

@ApiTags('Videos')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post(':id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('video'))
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({
    status: 201,
    description: 'The video has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile('video') file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return this.videoService.create(createVideoDto, file, id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    
   return this.videoService.update(id, updateVideoDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video by ID' })
  @ApiResponse({ status: 200, description: 'Video successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
