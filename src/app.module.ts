import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
import { CourseModule } from './modules/course/course.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { cloudinaryConfig, envs } from './config';
import { SeederModule } from './modules/seeder/seeder.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    UserModule,
    VideoModule,
    CourseModule,
    OrderModule,
    ReviewModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
      secret: envs.jwtSecret,
    }),
    SeederModule,
    FilesModule,
  ],
  controllers: [],
  providers: [cloudinaryConfig],
})
//
export class AppModule {}
