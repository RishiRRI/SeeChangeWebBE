import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  isArray,
} from 'class-validator';

export class CreateRcycUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(4)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  accountType: string;

  // version: string;

  userRegistrationAccess: number;

}
