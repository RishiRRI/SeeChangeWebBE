import { IsNotEmpty, IsString, Length, min } from 'class-validator';

export class RcycLoginDto {
    @IsNotEmpty()
    @IsString()
    @Length(10,15)
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Length(8)
    password: string;

    version: string;
}
