export class CreateAssessmentQuestionDto {
    readonly mainQuestion: string;
    readonly options: Array<{ option: string; rating: number }>;
  }
  