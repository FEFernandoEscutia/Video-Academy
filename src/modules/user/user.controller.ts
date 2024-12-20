import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import * as bcrypt from 'bcryptjs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateUserInterceptor } from 'src/interceptors/createUser.interceptor';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //*************************************************************************************
  @Post()
  @ApiOperation({
    summary: 'Create user profile',
    description: `This endpoint allows creating user profiles. Any user can create their own profile. The required data is passed via the 'CreateUserDto'.`,
  })
  @UseInterceptors(CreateUserInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve users with pagination',
    description:
      'Allows an admin to retrieve a paginated list of users. Optional query parameters: `page` (default 1) and `limit` (default 10). Authentication and admin role required.',
  })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve user by ID',
    description:
      'This endpoint allows both Admin and User roles to retrieve user information. Admins can retrieve any user by ID, while Users can only retrieve their own information. Authentication is required.',
  })
  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async findOne(@Param('id') id: string, @Req() req: any) {
    const requestingUser = req.user;
    const userDb = await this.userService.findOneWEmail(requestingUser.email);

    if (requestingUser.roles === Role.ADMIN) {
      return this.userService.findOne(id);
    }
    if (requestingUser.roles === Role.USER) {
      return this.userService.findOne(userDb.id);
    }
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: `Admins can update any user's information, including admin privileges, and can specify the user ID in the parameter.
                  Regular users can only update their own profile, and their ID is automatically set.`,
  })
  @Patch()
  @UseGuards(AuthGuard)
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const requestingUser = req.user;
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    const { role, isBanned, ...data } = updateUserDto;
    return this.userService.update(requestingUser.id, data);
    //
  }

  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile',
    description: `Admins can update any user's information, including admin privileges, and can specify the user ID in the parameter.
                   Regular users can only update their own profile, and their ID is automatically set.`,
  })
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async unBanned(@Param('id') id: string, @Body('isBanned') isBanned: boolean) {
    return this.userService.unBanned(isBanned, id);
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user by ID',
    description:
      'This endpoint allows both Admin and User roles to delete a user. Admins can delete any user by ID, while Users can only delete their own account. Authentication is required.',
  })
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param('id') id: string, @Req() req: any) {
    const requestingUser = req.user;
    if (requestingUser.roles === Role.ADMIN) {
      return this.userService.remove(id);
    }
    if (requestingUser.roles === Role.USER) {
      return this.userService.fullyRemove(requestingUser.id);
    }
  }
}
