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
import { EmailService } from 'src/emails/emails.service';

@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('User Service');
  constructor(private readonly emailService: EmailService) {
    super();
  }
  //****************************************************************************************************
  async onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
    const hashPassword = await bcrypt.hash(envs.Admin0Password, 10);
    const aUser0: UpdateUserDto = {
      name: envs.Admin0Name,
      email: envs.Admin0Email,
      password: hashPassword,
      phone: envs.Admin0phone,
      role: Role.ADMIN,
    };
    const dbUser = await this.user.findFirst({
      where: { email: aUser0.email },
    });
    if (dbUser) {
      return this.logger.log('Admin0 was found');
    }
    await this.user.create({
      data: {
        name: aUser0.name,
        email: aUser0.email.toLowerCase(),
        password: aUser0.password,
        phone: aUser0.phone,
        role: aUser0.role,
      },
    });
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
    await this.emailService.sendWelcomeEmail(
      createUserDto.email,
      createUserDto.name,
    );
    this.logger.log(`Welcome email sent to ${createUserDto.email}`);
    return await this.user.create({
      data: { ...rData, password: hashPassword, role: Role.USER },
    });
  }

  //****************************************************************************************************

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, name, email } = paginationDto;
    const totalPages = await this.user.count({
      where: {
        ...(name && { name: { contains: name, mode: 'insensitive' } }),
        ...(email && { email: { contains: email, mode: 'insensitive' } }),
      },
    });
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
        where: {
          ...(name && { name: { contains: name, mode: 'insensitive' } }),
          ...(email && { email: { contains: email, mode: 'insensitive' } }),
        },
        include: {
          orders: true,
          courses: true,
        },
      }),
      metaData: {
        page: page,
        total: totalPages,
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
