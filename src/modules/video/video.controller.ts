import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  //UseGuards,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
//import { AuthGuard } from '@nestjs/passport';
//import { RolesGuard } from 'src/guards/roles.guard';
//import { Roles } from 'src/decorators/role.decorator';
//import { Role } from '@prisma/client';

@ApiTags('Videos')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({
    status: 201,
    description: 'The video has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles(Role.ADMIN)
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videoService.create(createVideoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all videos' })
  @ApiResponse({
    status: 200,
    description: 'List of videos successfully retrieved.',
  })
  //@UseGuards(AuthGuard)
  findAll() {
    return this.videoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a video by ID' })
  @ApiResponse({ status: 200, description: 'Video successfully retrieved.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a video by ID' })
  @ApiResponse({ status: 200, description: 'Video successfully updated.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(id, updateVideoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video by ID' })
  @ApiResponse({ status: 200, description: 'Video successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Video not found.' })
  //@UseGuards(AuthGuard, RolesGuard)
  //@Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.videoService.remove(id);
  }
}
