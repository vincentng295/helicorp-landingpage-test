import { Controller, Post, Body, Logger } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/landing-page.dto';
import { AnalyticsService } from './analytics/analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger('HelicorpBackend');

   constructor(private readonly analyticsService: AnalyticsService) {} 

  @Post('subscriptions')
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    this.logger.log(`[Subscription Received] Khách hàng: ${dto.name} | Email: ${dto.email}`);
    
       this.analyticsService.addSubscription(dto);
    
    return {
      success: true,
      message: 'Dữ liệu đăng ký nhận tin hợp lệ và đã được lưu trữ thành công.',
    };
  }

 
  @Post('tracking')
  trackUserBehavior(@Body() dto: TrackEventDto) {
    this.logger.warn(`[User Action Tracking] Event: ${dto.eventName} | URL: ${dto.pageUrl} | Detail: ${dto.metadata?.detail}`);

    this.analyticsService.addTrackingLog(dto);
    
    return {
      success: true,
      received: true
    };
  }
}