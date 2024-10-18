import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@prisma/client';
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  //****************************************************************************************************
  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await  this.courseService.create(createCourseDto);
  }
  //****************************************************************************************************

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findAll(@Req() req: any) {
    const user = req.user;
  
    if (user.role === Role.ADMIN) {
  
      return this.courseService.findAll();
    } else if (user.role === Role.USER) {
     
      return this.courseService.findCourseAvailable();
    }
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
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.ADMIN)
async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto, @Req() req: any) {
  const user = req.user;


  if (user.role !== Role.ADMIN) {
    throw new ForbiddenException('No tienes permiso para modificar este curso.');
  }

  return this.courseService.update(id, updateCourseDto);
}

  //****************************************************************************************************

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
  
   
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException('No tienes permiso para eliminar este curso.');
    }
  
    return this.courseService.remove(id);
  }
  





}