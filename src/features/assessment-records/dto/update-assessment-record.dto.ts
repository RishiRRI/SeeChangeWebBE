import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentRecordDto } from './create-assessment-record.dto';

export class UpdateAssessmentRecordDto extends PartialType(CreateAssessmentRecordDto) {}
