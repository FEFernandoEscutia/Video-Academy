import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException, HttpCode } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@prisma/client';
import { CourseFilterDto } from './dto/filter-course.dto';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  //**********************************CREATED COURSE **********************************************
   
  @ApiOperation({
    summary: 'Create a new course',
    description: 'This endpoint allows only Admins to create a new course. Authentication is required.'
  })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only Admins can create courses.' })
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }
  
  //************************************* FIND ALL COURSE *********************************** */
  @ApiOperation({
    summary: 'Retrieve all courses',
    description: 'This endpoint allows anyone to retrieve all courses. Optionally, filters can be applied to narrow down the results.'
  })
  @ApiQuery({
    name: 'technologies',
    required: false,
    description: 'List of technologies to filter by',
    type: [String],
    example: ['JavaScript', 'Python']
  })
  @ApiQuery({
    name: 'priceSelector',
    required: false,
    description: `
    Filters courses based on price. 
    - 'true' sorts courses by ascending price (cheapest first).
    - 'false' sorts courses by descending price (most expensive first).
    Optionally, you can also filter by technologies.
  `,
    enum: ['true', 'false'],
    example: 'true'
  })
  @Get()
  async findAll(@Query() filterDto: CourseFilterDto) {
    return this.courseService.findAll(filterDto);
  }

  //*******************************************  FIND BY ID *************************************** */
  @ApiOperation({
    summary: 'Retrieve a single course by ID',
    description: 'This endpoint allows anyone to retrieve a specific course by its ID.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to retrieve',
    example: '1f7c73c72-c37d-438e-bd9c-67ce5f0d8b08'
  })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const courseByID = await this.courseService.findOne(id)
    if(!courseByID){
      throw new NotFoundException('course not found')
    }
    return courseByID;
  }
  //************************************ update course ******************************** */

  @ApiOperation({
    summary: 'Update a course',
    description: 'This endpoint allows only Admins to update a course. Authentication is required.'
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to update',
    example: '1'
  })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only Admins can update courses.' })
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

 
  //************************************  delete course ********************************* */

  @ApiOperation({
    summary: 'Delete a course',
    description: 'This endpoint allows only Admins to delete a course. Authentication is required.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to delete',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only Admins can delete courses.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string) {
    const courseById = await this.courseService.remove(id);
    
    // Verificar si el curso fue encontrado
    if (!courseById) {
      throw new NotFoundException('Course not found');
    }
  
    return courseById;
  }
  
}