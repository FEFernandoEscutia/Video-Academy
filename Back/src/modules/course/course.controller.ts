import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  //****************************************************************************************************
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await  this.courseService.create(createCourseDto);
  }
  //****************************************************************************************************
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.courseService.findAll();
  }
  //****************************************************************************************************
  @Get('/available')
  async findCourseAvailable(){
    return await this.courseService.findCourseAvailable();
  }
  //****************************************************************************************************
  @Get('course/popular')
  async findCoursePopular(){
    return await this.courseService.findCoursePopular();
  }
  //****************************************************************************************************
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(id);
  }
  //****************************************************************************************************
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }
  //****************************************************************************************************
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
