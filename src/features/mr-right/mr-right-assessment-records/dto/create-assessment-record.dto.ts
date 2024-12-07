import { IsNotEmpty, IsMongoId, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssessmentRecordDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionResponseDto)
    responses: QuestionResponseDto[];
  }
  
  export class QuestionResponseDto {
    @IsNotEmpty()
    @IsMongoId()
    questionId: string;  // keep questionId here
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RatingDto)
    ratings: RatingDto[];
  }
  
  
  export class RatingDto {
    @IsNotEmpty()
    @IsNumber()
    rating: number;  // Rating for a particular option
  }