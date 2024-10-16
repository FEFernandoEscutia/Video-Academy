import { Module } from '@nestjs/common';

import { UserModule } from './modules/user/user.module';
import { VideoModule } from './modules/video/video.module';
import { CourseModule } from './modules/course/course.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';


@Module({
  imports: [UserModule, VideoModule, CourseModule, OrderModule, ReviewModule, SubscriptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
