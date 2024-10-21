import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { envs } from 'src/config';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('User Service');
  //****************************************************************************************************
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
    const aUser0 = {
      name: envs.Admin0Name,
      email: envs.Admin0Email,
      password: envs.Admin0Password,
      phone: envs.Admin0phone,
      role: Role.ADMIN,
    };
    const dbUser = await this.user.findFirst({
      where: { email: aUser0.email },
    });
    if (dbUser) {
      return this.logger.log('Admin0 was found');
    }
    await this.create(aUser0);
    this.logger.log('Admin0 was created successfully');
  }

  //****************************************************************************************************
  async create(createUserDto: CreateUserDto) {
    const { password, role, ...rData } = createUserDto;
    const dbUser = await this.user.findFirst({
      where: {
        OR: [{ phone: createUserDto.phone }, { email: createUserDto.email }],
      },
    });
    if (dbUser) {
      throw new ConflictException(
        `The email or phone number is already registered `,
      );
    }
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.user.create({
      data: { ...rData, password: hashPassword, role: Role.USER },
    });
  }

  //****************************************************************************************************

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.user.count({});
    const lastPage = Math.ceil(totalPages / limit);
    if (page > lastPage) {
      throw new BadRequestException(
        `Please select a valid page between 1 to ${lastPage}`,
      );
    }
    return {
      data: await this.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      metaData: {
        page: page,
        total: totalPages,
        UsersShown: limit,
        lastPage: lastPage,
      },
    };
  }

  //****************************************************************************************************

  async findOneWEmail(email: string) {
    return await this.user.findFirst({ where: { email: email } });
  }

  //****************************************************************************************************

  async findOne(id: string) {
    const dbUser = await this.user.findFirst({ where: { id } });
    if (!dbUser) {
      throw new BadRequestException('Wrong id was provided, please verify');
    }
    return dbUser;
  }

  //****************************************************************************************************

  async update(id: string, updateUserDto: UpdateUserDto) {
    const dbUser = await this.findOne(id);
    if (!dbUser) {
      throw new BadRequestException('user does not exist');
    }
    const wrongRequest = await this.user.findFirst({
      where: {
        OR: [{ phone: updateUserDto.phone }, { email: updateUserDto.email }],
      },
    });
    if (wrongRequest) {
      throw new BadRequestException('Email or phone number already exist');
    }
    await this.user.update({ where: { id }, data: { ...updateUserDto } });
    return { message: 'User has been updated correctly, please log back in' };
  }

  //****************************************************************************************************

  async remove(id: string) {
    const userDb = await this.findOne(id);
    if (!userDb) {
      throw new BadRequestException('User does not exist');
    }
    await this.user.delete({
      where: {
        id,
      },
    });
    return { message: 'User has been deleted' };
  }
}
