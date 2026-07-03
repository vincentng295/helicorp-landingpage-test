import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from '../dto/login.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private sessions: Map<string, any> = new Map();


  constructor(private readonly jwtService: JwtService) {}

  /**
   * Xác thực thông tin tài khoản Admin hệ thống và cấp phát JWT
   */
  async validateAdmin(loginDto: AdminLoginDto): Promise<{ accessToken: string }> {
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'helicorp2026';

    if (
      loginDto.username !== expectedUsername ||
      loginDto.password !== expectedPassword
    ) {
      this.logger.warn(`[Auth] Failed login attempt for username: ${loginDto.username}`);
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không chính xác.');
    }

    this.logger.log(`[Auth] Admin logged in successfully.`);


    const payload = { username: loginDto.username, role: 'admin' };
    
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  /**
   * Lấy toàn bộ dữ liệu phân tích chi tiết cho Dashboard
   */
  async getDashboardAnalytics() {
    const sessionArray = Array.from(this.sessions.values());
    
    let totalClicks = 0;
    let totalScrollPercent = 0;
    let totalDuration = 0;

    const clicksData: Record<string, number> = {};
    const devices = { desktop: 0, mobile: 0 };

    sessionArray.forEach((s) => {
      totalClicks += s.clicks || 0;
      totalScrollPercent += s.maxScrollPercent || 0;
      totalDuration += s.durationSeconds || 0;
      const devType = (s.device || 'desktop').toLowerCase();
      if (devType.includes('mobile')) {
        devices.mobile++;
      } else {
        devices.desktop++;
      }
      if (s.lastClickedElement) {
        clicksData[s.lastClickedElement] = (clicksData[s.lastClickedElement] || 0) + 1;
      }
    });

    const totalSessions = sessionArray.length;

    return {
      totalSessions,
      totalClicks,
      avgScroll: totalSessions ? Math.round(totalScrollPercent / totalSessions) : 0,
      avgTime: totalSessions ? Math.round(totalDuration / totalSessions) : 0,
      devices,
      clicksData,
      recentLogs: sessionArray.slice(-20).reverse(),
    };
  }
}