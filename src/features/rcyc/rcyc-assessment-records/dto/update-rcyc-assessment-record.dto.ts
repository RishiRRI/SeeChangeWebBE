import { PartialType } from '@nestjs/mapped-types';
import { CreateRcycAssessmentRecordDto } from './create-rcyc-assessment-record.dto';

export class UpdateRcycAssessmentRecordDto extends PartialType(CreateRcycAssessmentRecordDto) {}
