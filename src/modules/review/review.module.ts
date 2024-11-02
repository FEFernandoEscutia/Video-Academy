import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config';
import { ContentFilterService } from '../../services/content-filter.service';

@Module({
  imports: [
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ContentFilterService],
})
export class ReviewModule {}
