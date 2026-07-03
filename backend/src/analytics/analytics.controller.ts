import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';
import { AdminLoginDto } from '../dto/login.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Endpoint xử lý form đăng nhập tại cổng Admin Gateway
   * Định tuyến: POST /api/analytics/login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: AdminLoginDto) {
    return this.analyticsService.validateAdmin(loginDto);
  }

  /**
   * Endpoint cung cấp toàn bộ dữ liệu thống kê đồ thị và bảng nhật ký
   * Định tuyến: GET /api/analytics
   * Bảo mật: Chỉ cho phép truy cập nếu đính kèm JWT hợp lệ
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAdminStats() {
    return this.analyticsService.getDashboardAnalytics();
  }
}