import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  HttpException,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@prisma/client';
import { CourseFilterDto } from './dto/filter-course.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiTags,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { SpecialGuard } from 'src/guards/special.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Courses')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  //**********************************CREATED COURSE **********************************************

  @ApiOperation({
    summary: 'Create a new course',
    description:
      'This endpoint allows only Admins to create a new course. Authentication is required.',
  })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Admins can create courses.',
  })
  @Post()
  // @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
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
  @Roles(Role.ADMIN)
  async create(
    @Query('technologies') techs: string[],
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.courseService.create(techs, createCourseDto, file);
  }

  //************************************* FIND ALL COURSE *********************************** */
  @ApiOperation({
    summary: 'Retrieve all courses',
    description:
      'This endpoint allows anyone to retrieve all courses. Optionally, filters can be applied to narrow down the results.',
  })
  @ApiQuery({
    name: 'technologies',
    required: false,
    description: 'List of technologies to filter by',
    type: [String],
    example: ['JavaScript', 'Python'],
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
    example: 'true',
  })
  @Get()
  @UseGuards(SpecialGuard)
  async findAll(@Query() filterDto: CourseFilterDto) {
    return this.courseService.findAll(filterDto);
  }
  //**********************************FIND MY COURSES **********************************************

  @Get('My-Courses')
  @ApiOperation({
    summary: 'Get user’s purchased courses',
    description: `Retrieves all courses bought by the logged-in user. Authentication required.`,
  })
  @UseGuards(AuthGuard)
  async findMyCourses(@Req() req: any) {
    const loggedUser = req.user;
    return this.courseService.findMyCourses(loggedUser.id);
  }
  //***************************************** search filter by title ***********************************************************

  @ApiOperation({
    summary: 'Search courses by title',
    description: `
      This endpoint allows users to search for courses based on a given keyword in the course titles.
      If no courses match the provided keyword, a 404 error is returned.
    `,
  })
  @ApiParam({
    name: 'keyword',
    description: 'The keyword to search for in course titles',
    example: 'Course JavaScript',
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses matching the title keyword.',
  })
  @ApiResponse({
    status: 404,
    description: 'No courses found matching the provided keyword in the title.',
  })
  @Get('search')
  async searchCourses(@Query('keyword') keyword: string) {
    const searchKeyword = await this.courseService.searchCourses(keyword);

    if (searchKeyword.length === 0) {
      throw new HttpException('Not found Result', HttpStatus.NOT_FOUND);
    }
    return searchKeyword;
  }

  //*******************************************  FIND BY ID *************************************** */
  @ApiOperation({
    summary: 'Retrieve a single course by ID',
    description:
      'This endpoint allows anyone to retrieve a specific course by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to retrieve',
    example: '1f7c73c72-c37d-438e-bd9c-67ce5f0d8b08',
  })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const courseByID = await this.courseService.findOne(id);
    if (!courseByID) {
      throw new NotFoundException('course not found');
    }
    return courseByID;
  }
  //************************************ update course ******************************** */

  @ApiOperation({
    summary: 'Update a course',
    description:
      'This endpoint allows only Admins to update a course. Authentication is required.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to update',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Course updated successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Admins can update courses.',
  })
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.update(id, updateCourseDto);
  }

  //************************************  delete course ********************************* */

  @ApiOperation({
    summary: 'Delete a course',
    description:
      'This endpoint allows only Admins to delete a course. Authentication is required.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the course to delete',
    example: '1',
  })
  @ApiResponse({ status: 200, description: 'Course deleted successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only Admins can delete courses.',
  })
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
