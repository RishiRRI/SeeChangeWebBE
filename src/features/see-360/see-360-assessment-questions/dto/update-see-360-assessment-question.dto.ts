import { PartialType } from '@nestjs/mapped-types';
import { CreateSee360AssessmentQuestionDto } from './create-see-360-assessment-question.dto';

export class UpdateSee360AssessmentQuestionDto extends PartialType(CreateSee360AssessmentQuestionDto) {}
