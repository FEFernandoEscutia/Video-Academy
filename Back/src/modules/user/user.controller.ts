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
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Retrieve all users',
    description:
      'This endpoint allows an admin to retrieve a list of all users from the system. Authentication and admin role are required.',
  })
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Retrieve user by ID', 
    description: 'This endpoint allows both Admin and User roles to retrieve user information. Admins can retrieve any user by ID, while Users can only retrieve their own information. Authentication is required.' 
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
  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    const requestingUser = req.user;
    const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
    if (requestingUser.roles === Role.ADMIN) {
      const { password, ...data } = updateUserDto;
      return this.userService.update(id, { password: hashedPassword, ...data });
    }
    if (requestingUser.roles === Role.USER) {
      const userDb = await this.userService.findOneWEmail(requestingUser.email);
      const { role, password, ...data } = updateUserDto;
      return this.userService.update(userDb.id, {
        role: Role.USER,
        password: hashedPassword,
        ...data,
      });
    }
  }
  //*************************************************************************************
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'This endpoint allows both Admin and User roles to delete a user. Admins can delete any user by ID, while Users can only delete their own account. Authentication is required.'
  })
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async remove(@Param('id') id: string, @Req() req: any) {
    const requestingUser = req.user;
    if (requestingUser.roles === Role.ADMIN) {
      return this.userService.remove(id);
    }
    if (requestingUser.roles === Role.USER) {
      const userDb = await this.userService.findOneWEmail(requestingUser.email);
      return this.userService.remove(userDb.id);
    }
  }
}
