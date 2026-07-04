import { Controller, Post, Body, Logger, Get } from '@nestjs/common';
import { CreateSubscriptionDto, CreateTrackingDto } from './dto/landing-page.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger('HelicorpBackend');

  constructor(private readonly appService: AppService) {} 

  private subscriptions: CreateSubscriptionDto[] = [];

  @Post('subscriptions')
  createSubscription(@Body() dto: CreateSubscriptionDto) {
    this.logger.log(`[Subscription Received] Khách hàng: ${dto.name} | Email: ${dto.email}`);
    this.subscriptions.push(dto);
    
    return {
      success: true,
      message: 'Dữ liệu đăng ký nhận tin hợp lệ và đã được lưu trữ thành công.',
    };
  }

  @Get('subscriptions')
  getSubscriptions() {
    return this.subscriptions;
  }

  @Post('tracking')
  trackUserBehavior(@Body() dto: CreateTrackingDto) {
    this.logger.warn(`[User Action Tracking] Loại: ${dto.event_type} -> Chi tiết: ${dto.detail} lúc ${dto.timestamp}`);
    
    return {
      success: true,
      received: true
    };
  }
}