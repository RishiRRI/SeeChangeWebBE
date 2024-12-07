import {
  IsNotEmpty,
  IsMongoId,
  IsArray,
  ValidateNested,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

// export class AnsweredDto {
//   @IsNotEmpty()
//   @IsString()
//   option: string;

//   @IsString()
//   value: string;

//   @IsNumber()
//   marks: number;
// }

export class AnsweredDto {
  @IsNotEmpty()
  @IsMongoId()
  optionId: string; // Now accepts only the option ID
}


export class QuestionResponseDto {
  @IsNotEmpty()
  @IsMongoId()
  questionId: string;

  @ValidateNested()
  @Type(() => AnsweredDto) 
  answered: AnsweredDto;
}

export class CreateSee360AssessmentRecordDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionResponseDto) 
  responses: QuestionResponseDto[];
}
