import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-helicorp-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, JwtStrategy],
  exports: [AnalyticsService, PassportModule],
})
export class AnalyticsModule {}