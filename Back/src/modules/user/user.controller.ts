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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
//*************************************************************************************
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
//*************************************************************************************
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.findAll();
  }
//*************************************************************************************
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
