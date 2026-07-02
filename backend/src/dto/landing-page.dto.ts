import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  name: string;

  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;
}

export class CreateTrackingDto {
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsString()
  @IsOptional()
  timestamp: string;
}