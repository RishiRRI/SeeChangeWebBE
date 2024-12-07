export class CreateRcycAssessmentQuestionDto {
    readonly mainQuestion: string;
    readonly options: Array<{ option: string; value: string; rating: number }>;
  }
  