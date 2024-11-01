import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  private readonly logger = new Logger('Review Service');
  constructor(
    private readonly reviewService: ReviewService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
    @Query('courseId') courseId: string,
  ) {
    console.log('Req(): ' + req);
    console.log('Req()userID: ' + req.user.id);
    const userId = req.user.id;
    return this.reviewService.create({
      ...createReviewDto,
      userId,
      courseId,
    });
  }

  @Get('top')
  @ApiOperation({ summary: 'Retrieve the top 6 diverse reviews' })
  @ApiResponse({
    status: 200,
    description: 'List of top 6 reviews successfully retrieved.',
  })
  findTopReviews() {
    return this.reviewService.findTopReviews();
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all reviews with course and user information',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reviews successfully retrieved.',
  })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a review by ID with course and user information',
  })
  @ApiResponse({
    status: 200,
    description: 'Review successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'Review successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
