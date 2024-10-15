import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
import { CourseModule } from './course/course.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import { SubscriptionModule } from './subscription/subscription.module';


@Module({
  imports: [UserModule, VideoModule, CourseModule, OrderModule, ReviewModule, SubscriptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
