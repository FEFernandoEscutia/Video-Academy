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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
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
@ApiOperation({
  summary: 'Retrieve video by ID',
  description: 'Fetches a single video by its ID. User authentication is required.',
})
@ApiParam({
  name: 'id',
  type: String,
  description: 'Unique identifier of the video to retrieve',
})
@ApiResponse({
  status: 200,
  description: 'Video retrieved successfully.',
})
@ApiResponse({
  status: 404,
  description: 'Video not found.',
})
@UseGuards(AuthGuard)
findOne(@Param('id') id: string) {
  return this.videoService.findOne(id);
}

@Patch(':id')
@ApiOperation({
  summary: 'Update video by ID',
  description: 'Updates a video by its ID. Only Admins can perform this action. Supports optional file upload for video updates.',
})
@ApiParam({
  name: 'id',
  type: String,
  description: 'Unique identifier of the video to update',
})
@ApiBody({
  type: UpdateVideoDto,
  description: 'DTO containing the fields to update for the video',
})
@ApiConsumes('multipart/form-data')
@ApiResponse({
  status: 200,
  description: 'Video updated successfully.',
})
@ApiResponse({
  status: 403,
  description: 'Forbidden. Only Admins are allowed to update videos.',
})
@ApiResponse({
  status: 404,
  description: 'Video not found.',
})
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
