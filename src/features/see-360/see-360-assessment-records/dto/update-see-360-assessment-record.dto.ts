import { PartialType } from '@nestjs/mapped-types';
import { CreateSee360AssessmentRecordDto } from './create-see-360-assessment-record.dto';

export class UpdateSee360AssessmentRecordDto extends PartialType(CreateSee360AssessmentRecordDto) {}
