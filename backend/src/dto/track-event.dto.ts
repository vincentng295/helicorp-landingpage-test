import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class TrackEventDto {
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsNotEmpty()
  pageUrl: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}