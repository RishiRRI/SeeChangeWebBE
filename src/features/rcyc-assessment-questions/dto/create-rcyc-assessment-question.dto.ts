export class CreateRcycAssessmentQuestionDto {
    readonly mainQuestion: string;
    readonly options: Array<{ option: string; rating: number }>;
  }
  