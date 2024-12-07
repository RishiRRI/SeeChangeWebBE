import { IsArray, IsBoolean, IsEnum, IsNotEmpty,  IsString,  MaxLength, MinLength, isArray } from "class-validator";

export class UpdateUserDto {

    @IsString()
    fullName: string;

    @IsString()
    email: string;

    @MinLength(10)
    @MaxLength(15)
    @IsString()
    phoneNumber: string;

    @MinLength(8)
    @IsString()
    password: string;

    fcmToken: string;

    isSuperAdmin: boolean;

    pdfAccess: string[];
    
    userStatus: string;


}
