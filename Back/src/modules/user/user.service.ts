import {
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
      role:Role.ADMIN
    };
    const dbUser = await this.user.findFirst({
      where: { email: aUser0.email },
    });
    if(dbUser){
      return this.logger.log("Admin0 was found")
    }
    await this.create(aUser0);
    this.logger.log('Admin0 was created successfully');
  }

   //****************************************************************************************************
  async create(createUserDto: CreateUserDto) {
    const { password, ...rData } = createUserDto;
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
    return this.user.create({ data: { ...rData, password: hashPassword } });
  }

   //****************************************************************************************************

  findAll() {
    return this.user.findMany({});
  }

   //****************************************************************************************************

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

   //****************************************************************************************************

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

   //****************************************************************************************************

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
