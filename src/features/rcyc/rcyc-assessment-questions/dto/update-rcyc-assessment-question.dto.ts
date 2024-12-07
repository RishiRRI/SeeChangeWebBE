import { PartialType } from '@nestjs/mapped-types';
import { CreateRcycAssessmentQuestionDto } from './create-rcyc-assessment-question.dto';

export class UpdateRcycAssessmentQuestionDto extends PartialType(CreateRcycAssessmentQuestionDto) {}
